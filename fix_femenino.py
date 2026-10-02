with open('components/disciplinas/futbol/femenino/Femenino.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('} from "./FemeninoUI";', '} from "./FemeninoUI";\nimport { TablaFinalesIdaVueltaCard } from "../inferiores/InferioresUI";')

old_render = '''                  <div className="space-y-4 min-w-0">
                    <TablaLlavesCard
                      rows={repechajeRows}
                      title={tournamentId === "oficial-2026-fem" ? "Playoffs" : tournament.ui.repechajeTitle}
                      phase={tournament.ui.repechajePhase || "Fase Eliminatoria"}
                      footnote={repechajeFootnote || getFootnote("repechajeFootnote", "Formato: semifinales y final.")}
                    />

                    {tournamentId !== "oficial-2026-fem" && (
                      <TablaPetitLikeRepechaje
                        rows={petitRows}
                        title={tournament.ui.petitTitle}
                        phase={tournament.ui.petitPhase}
                        footnote={petitFootnote || getFootnote("petitFootnote", "Formato: semifinales ida/vuelta y final única.")}
                      />
                    )}
                  </div>'''

# wait, unique encoding char might be in única
old_render = old_render.replace('única', 'gnica')

new_render = '''                  <div className="space-y-4 min-w-0">
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
                  </div>'''

if old_render in text:
    print('Found old render, replacing...')
    text = text.replace(old_render, new_render)
else:
    print('COULD NOT FIND OLD RENDER')

old_normalize = '''            fetchJSON(${base}&type=)
              .then((j) => ({
                rows: normalizePetitFinalSingleLeg(withTeamLogosRows(Array.isArray(j?.rows) ? j.rows : [])),
                footnote: j?.footnote || null,
              }))'''

new_normalize = '''            fetchJSON(${base}&type=)
              .then((j) => ({
                rows: tournament.id === "oficial-2026-fem" ? withTeamLogosRows(Array.isArray(j?.rows) ? j.rows : []) : normalizePetitFinalSingleLeg(withTeamLogosRows(Array.isArray(j?.rows) ? j.rows : [])),
                footnote: j?.footnote || null,
              }))'''

if old_normalize in text:
    print('Found old normalize, replacing...')
    text = text.replace(old_normalize, new_normalize)
else:
    print('COULD NOT FIND OLD NORMALIZE')

with open('components/disciplinas/futbol/femenino/Femenino.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
