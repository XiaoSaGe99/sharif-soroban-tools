import { Logger } from "@nestjs/common";
import { HORIZON_BASE_URLS } from "../config/stellar.config";
import axios from "axios";

const logger = new Logger("RpcSecurityAudit");

interface AuditResult {
  endpoint: string;
  isSslValid: boolean;
  exposesSensitiveHeaders: boolean;
  corsPermissive: boolean;
  rateLimitResponsive: boolean;
}

/**
 * Programmatic security audit tool for configured RPC/Horizon topology
 */
async function runRpcSecurityAudit(): Promise<void> {
  logger.log("Starting Security Audit on RPC Load Balancing Tier...");
  
  const endpoints = Object.entries(HORIZON_BASE_URLS);
  const auditReports: AuditResult[] = [];

  for (const [network, url] of endpoints) {
    logger.log(`Auditing target network [${network}] at endpoint: ${url}`);
    
    const result: AuditResult = {
      endpoint: url,
      isSslValid: url.startsWith("https://"),
      exposesSensitiveHeaders: false,
      corsPermissive: false,
      rateLimitResponsive: false,
    };

    try {
      // 1. Audit Headers and CORS Configuration
      const response = await axios.options(url, {
        validateStatus: () => true,
        timeout: 5000,
      });

      const allowOrigin = response.headers["access-control-allow-origin"];
      if (allowOrigin === "*") {
        result.corsPermissive = true;
        logger.warn(`[SECURITY WARNING] Permissive CORS '*' discovered on network: ${network}`);
      }

      const serverHeader = response.headers["server"];
      if (serverHeader) {
        result.exposesSensitiveHeaders = true;
        logger.warn(`[INFO LEAK] Endpoint leaks server infrastructure signature: ${serverHeader}`);
      }

      // 2. High-volume burst emulation to verify Rate-Limiting Protection
      logger.log(`Simulating burst traffic to test rate-limit resilience on ${network}...`);
      const burstRequests = Array.from({ length: 20 }).map(() =>
        axios.get(`${url}/fee_stats`, { validateStatus: () => true, timeout: 3000 })
      );
      
      const burstResponses = await Promise.all(burstRequests);
      const hitRateLimit = burstResponses.some(res => res.status === 429);
      
      result.rateLimitResponsive = hitRateLimit;
      if (!hitRateLimit) {
        logger.warn(`[DOS VULNERABILITY] Endpoint did not return 429 across burst payload frames.`);
      }

    } catch (err) {
      const error = err as Error;
      logger.error(`Critical network handling fault during audit scanning: ${error.message}`);
    }

    auditReports.push(result);
  }

  console.table(auditReports);
  logger.log("RPC Load Balancing Security Audit complete.");
}

runRpcSecurityAudit().catch((err) => {
  console.error("Audit aborted due to unhandled fatal exception:", err);
  process.exit(1);
});