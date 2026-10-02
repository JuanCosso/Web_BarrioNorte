const fs = require("fs");

let text = fs.readFileSync("components/disciplinas/futbol/femenino/Femenino.jsx", "utf-8");

text = text.replace('} from "./FemeninoUI";', '} from "./FemeninoUI";\nimport { TablaFinalesIdaVueltaCard } from "../inferiores/InferioresUI";');

text = text.replace(
  'rows: normalizePetitFinalSingleLeg(withTeamLogosRows(Array.isArray(j?.rows) ? j.rows : [])),',
  'rows: tournament.id === "oficial-2026-fem" ? withTeamLogosRows(Array.isArray(j?.rows) ? j.rows : []) : normalizePetitFinalSingleLeg(withTeamLogosRows(Array.isArray(j?.rows) ? j.rows : [])),'
);

const startIdx = text.indexOf('<div className="space-y-4 min-w-0">');
const endIdx = text.indexOf('</div>', startIdx) + 6;

const newRender = `<div className="space-y-4 min-w-0">
                    {tournamentId === "oficial-2026-fem" ? (
                      <TablaFinalesIdaVueltaCard
                        rows={petitRows}
                        title="Playoffs"
                        phase="Fase Eliminatoria"
                        footnote={petitFootnote || getFootnote("petitFootnote", "Formato: semifinales y final a ida y vuelta.")}
                      />
                    ) : (
                      <>
                        <TablaLlavesCard
                          rows={repechajeRows}
                          title={tournament.ui.repechajeTitle}
                          phase={tournament.ui.repechajePhase || "Fase Eliminatoria"}
                          footnote={repechajeFootnote || getFootnote("repechajeFootnote", "Formato: semifinales y final.")}
                        />
                        <TablaPetitLikeRepechaje
                          rows={petitRows}
                          title={tournament.ui.petitTitle}
                          phase={tournament.ui.petitPhase}
                          footnote={petitFootnote || getFootnote("petitFootnote", "Formato: semifinales ida/vuelta y final única.")}
                        />
                      </>
                    )}
                  </div>`;

text = text.substring(0, startIdx) + newRender + text.substring(endIdx);

fs.writeFileSync("components/disciplinas/futbol/femenino/Femenino.jsx", text, "utf-8");
console.log("Done");
