import useSWR from "swr";

async function fetchAPI(key: string) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <DatabaseStatus />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText: string = "Carregando...";
  if (!isLoading && data)
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");

  return <div>Última atualização: {updatedAtText}</div>;
}

function DatabaseStatus() {
  const { isLoading, data } = useSWR("api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  return (
    <>
      <h2>Database</h2>
      {!isLoading && data ? (
        <>
          <div>Versão: {data.dependencies.database.version}</div>
          <div>
            Conexões abertas: {data.dependencies.database.opened_connections}
          </div>
          <div>
            Conexões Máximas: {data.dependencies.database.max_connections}
          </div>
        </>
      ) : (
        <p>Carregando...</p>
      )}
    </>
  );
}
