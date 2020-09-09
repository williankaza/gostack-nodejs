const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4')

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

/**
 * Verifica se o ID passado é um uuId
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function verifyRepositoryId(request, response, next){
  const { id } = request.params;

  if (!isUuid(id)){
    return response.status(400).json( { error: 'Invalid Repository ID' } );
  }

  return next()
}

/**
 * Inclui a verificação de ID nas rotas que mexem com ID
 */
app.use("/repositories/:id", verifyRepositoryId);
app.use("/repositories/:id/likes", verifyRepositoryId);

/**
 * Busca todos os repositórios
 */
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

/**
 * Cria um novo repositório
 */
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const likes = 0

  const repository = { id: uuid(), title, url, techs, likes }

  repositories.push(repository);

  return response.json(repository);
});

/**
 * Atualiza um repositório. Não atualiza a quantidade de likes
 */
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body;

  const repoIndex = repositories.findIndex(rep => rep.id === id);

  if (repoIndex < 0){
    return response.status(400).json( { error: 'Repository not found!' });  
  }

  const repoAlt = repositories[repoIndex]
  
  repoAlt.title = title ? title : repoAlt.title
  repoAlt.url = url ? url : repoAlt.url
  repoAlt.techs = techs ? techs : repoAlt.techs
  
  repositories[repoIndex] = repoAlt

  return response.json(repositories[repoIndex]);

});

/**
 * Deleta o repositório
 */
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repoIndex = repositories.findIndex(proj =>  proj.id === id );

  if (repoIndex < 0){
      return response.status(400).json( { error: 'Repository not found!' });
  } 
  
  repositories.splice(repoIndex, 1);
  
  return response.status(204).send();
});

/**
 * Adiciona um novo like ao repositório
 */
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params
  const repoIndex = repositories.findIndex(rep => rep.id === id);

  if (repoIndex < 0){
    return response.status(400).json( { error: 'Repository not found!' });  
  }
   
  repositories[repoIndex].likes++

  return response.json(repositories[repoIndex]);
});

module.exports = app;
