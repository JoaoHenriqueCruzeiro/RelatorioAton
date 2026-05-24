const { parentPort, workerData } = require("worker_threads");
const sql = require("mssql");

async function mapAndQuery(dbConfig, query, params) {
  const pool = new sql.ConnectionPool(dbConfig);
  await pool.connect();
  try {
    const request = pool.request();
    if (Array.isArray(params)) {
      for (const p of params) {
        if (!p || !p.name) continue;
        const type = p.type && sql[p.type] ? sql[p.type] : undefined;
        if (type) request.input(p.name, type, p.value);
        else request.input(p.name, p.value);
      }
    }
    const result = await request.query(query);
    return result.recordset;
  } finally {
    pool.close();
  }
}

(async () => {
  try {
    const dbConfig = workerData.dbConfig || {};
    const rows = await mapAndQuery(
      dbConfig,
      workerData.query,
      workerData.params || [],
    );
    parentPort.postMessage({ success: true, rows });
  } catch (err) {
    parentPort.postMessage({
      success: false,
      error: err.message || String(err),
    });
  }
})();
