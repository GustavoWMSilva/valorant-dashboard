import pandas as pd
import plotly.graph_objects as go
# como eu ativo o venv no terminal do windows?
# Ativar o ambiente virtual no terminal do Windows:
# 1. Navegue até o diretório do seu ambiente virtual:
#    cd caminho\para\seu\venv
# 2. Ative o ambiente virtual:
#    venv\Scripts\activate
anos = [2021, 2022, 2023, 2024, 2025]
dados = []

for ano in anos:
    caminho_base = f"pasta/valorant-champion-tour-2021-2023-data/vct_{ano}"
    
    try:
        df1 = pd.read_csv(f"{caminho_base}/players_stats/players_stats.csv", sep=";", on_bad_lines='skip')
        df2 = pd.read_csv(f"{caminho_base}/matches/overview.csv", sep=";", on_bad_lines='skip')

        df1.columns = df1.columns.str.strip()
        df2.columns = df2.columns.str.strip()

        df1.rename(columns={"Rating": "Rating_stats", "Agents": "Agents_stats"}, inplace=True)
        df2.rename(columns={"Rating": "Rating_overview", "Agents": "Agents_overview"}, inplace=True)

        merged = pd.merge(df1, df2, on=["Player", "Tournament", "Stage", "Match Type"], how="inner")
        merged["Rating_stats"] = pd.to_numeric(merged["Rating_stats"], errors="coerce")
        merged["First Kills Per Round"] = pd.to_numeric(merged["First Kills Per Round"], errors="coerce")

        merged = merged.dropna(subset=["Rating_stats", "First Kills Per Round"])

        merged["Faixa de Agressividade"] = pd.cut(
            merged["First Kills Per Round"],
            bins=[0, 0.05, 0.10, 0.15, 0.20, 0.30, 0.50],
            labels=["0–0.05", "0.05–0.10", "0.10–0.15", "0.15–0.20", "0.20–0.30", "0.30–0.50"]
        )
        merged["Ano"] = ano


        dados.append(merged)

    except Exception as e:
        print(f"Erro ao processar o ano {ano}: {e}")

# Concatenar sem separação por ano
df_total = pd.concat(dados, ignore_index=True)
df_limpo = df_total[df_total["Agents_stats"].str.count(",") == 0].copy()

# Agrupamento geral por agente e ano
df_grouped = df_limpo.groupby(["Ano", "Agents_stats", "Faixa de Agressividade"]).agg(
    Rating_stats=("Rating_stats", "mean"),
    Count=("Rating_stats", "count")
).reset_index()

# Agente virtual "Todos"
df_all = df_limpo.groupby(["Ano", "Faixa de Agressividade"]).agg(
    Rating_stats=("Rating_stats", "mean"),
    Count=("Rating_stats", "count")
).reset_index()
df_all["Agents_stats"] = "Todos"

df_final = pd.concat([df_grouped, df_all], ignore_index=True)

faixa_ordem = ["0–0.05", "0.05–0.10", "0.10–0.15", "0.15–0.20", "0.20–0.30", "0.30–0.50"]
df_final["Faixa de Agressividade"] = pd.Categorical(df_final["Faixa de Agressividade"], categories=faixa_ordem, ordered=True)
df_final = df_final.sort_values(by=["Agents_stats", "Faixa de Agressividade"])

# Cores por faixa
cores_por_faixa = {
 "0–0.05": "#AEC6CF",
 "0.05–0.10": "#FFB347",
 "0.10–0.15": "#77DD77",
 "0.15–0.20": "#FF6961",
 "0.20–0.30": "#CBAACB",
 "0.30–0.50": "#FDFD96"
}

# Figura geral
fig = go.Figure()
agente_inicial = "Todos"
dados_iniciais = df_final[df_final["Agents_stats"] == agente_inicial]
cores_iniciais = [cores_por_faixa.get(str(faixa), "#CCCCCC") for faixa in dados_iniciais["Faixa de Agressividade"]]

fig.add_trace(go.Bar(
    x=dados_iniciais["Faixa de Agressividade"],
    y=dados_iniciais["Rating_stats"],
    marker_color=cores_iniciais,
    text=dados_iniciais["Count"],
    hovertemplate="Faixa: %{x}<br>Rating Médio: %{y:.2f}<br>Nº de Jogadores: %{text}<extra></extra>"
))

# Dropdown de agentes
dropdown_buttons = []
agentes_unicos = df_final["Agents_stats"].unique()
for agente in agentes_unicos:
    dados_agente = df_final[df_final["Agents_stats"] == agente]
    cores_agente = [cores_por_faixa.get(str(faixa), "#CCCCCC") for faixa in dados_agente["Faixa de Agressividade"]]

    dropdown_buttons.append(
        dict(
            label=agente,
            method="update",
            args=[{"x": [dados_agente["Faixa de Agressividade"]],
                   "y": [dados_agente["Rating_stats"]],
                   "marker.color": [cores_agente],
                   "text": [dados_agente["Count"]]}]
        )
    )

# Layout
fig.update_layout(
    updatemenus=[dict(
        buttons=dropdown_buttons,
        direction="down",
        showactive=True,
        x=0.5,
        xanchor="center",
        y=1.15,
        yanchor="top"
    )],
    title=f"Rating Médio por Faixa de Agressividade (First Kills por Round)",
    xaxis_title="Faixa de Agressividade",
    yaxis_title="Rating Médio"
)

# fig.write_html("grafico_valorant_consolidado.html", include_plotlyjs="cdn")
# fig.show()

df_final.to_json("grafico_valorant.json", orient="records", indent=2)
# Exporta dados brutos para histograma
df_limpo[["Ano", "Agents_stats", "First Kills Per Round"]].to_json(
    "aggressiveness_raw.json", orient="records", indent=2
)


