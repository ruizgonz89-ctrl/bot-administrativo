const express = require("express");
const app = express();

app.use(express.json());

const partes = {};

const departamentos = [
  "SECRETARIA",
  "ODM",
  "DETALLIA",
  "ACTIVIDADES",
  "OPERACIONES",
  "LOGISTICA",
  "SEGURIDAD"
];

app.post("/parte", (req, res) => {
  const data = req.body;

  const depto = data.departamento?.toUpperCase();

  if (!departamentos.includes(depto)) {
    return res.status(400).send("Departamento inválido");
  }

  const FE = Number(data.FE || 0);
  const COMD = Number(data.COMD || 0);
  const COML = Number(data.COML || 0);
  const GUAR = Number(data.GUAR || 0);
  const TRA = Number(data.TRA || 0);
  const PREV = Number(data.PREV || 0);

  const FA = COMD + COML + GUAR + TRA + PREV;
  const FO = FE - FA;

  if (FA > FE) {
    return res.status(400).send("ERROR: FA supera FE");
  }

  partes[depto] = {
    FE,
    FO,
    FA,
    COMD,
    COML,
    GUAR,
    TRA,
    PREV
  };

  res.send(generarParteGeneral());
});

function generarParteGeneral() {

  let totalFE = 0;
  let totalFO = 0;
  let totalFA = 0;

  let texto = "BOT ADMINISTRATIVO\n\n";
  texto += "PARTE GENERAL\n\n";

  for (const depto of Object.keys(partes)) {

    const p = partes[depto];

    totalFE += p.FE;
    totalFO += p.FO;
    totalFA += p.FA;

    texto += `====================\n`;
    texto += `${depto}\n\n`;
    texto += `FE: ${p.FE}\n`;
    texto += `FO: ${p.FO}\n`;
    texto += `FA: ${p.FA}\n\n`;
  }

  texto += `====================\n`;
  texto += `TOTAL GENERAL\n\n`;
  texto += `FE: ${totalFE}\n`;
  texto += `FO: ${totalFO}\n`;
  texto += `FA: ${totalFA}\n`;

  return texto;
}

app.listen(process.env.PORT || 3000, () => {
  console.log("BOT ADMINISTRATIVO ONLINE");
});
