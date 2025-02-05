import axios from "axios";

async function verifierExistence(urls) {
  const results = await Promise.all(
    urls.map((url) =>
      axios
        .get(url)
        .then((response) => (response.status === 200 ? null : response.status))
        .catch((error) =>
          error.response ? error.response.data : "Erreur réseau"
        )
    )
  );
  const erreurs = results.filter((res) => res !== null);
  return erreurs.length === 0 ? true : erreurs;
}

function getVolume(url) {
  return axios
    .get(url)
    .then((response) => {
      const json = response.data;

      if (
        Array.isArray(json) &&
        json.length > 0 &&
        json[0].volume !== undefined
      ) {
        return json[0].volume;
      } else {
        throw new Error("Le champ 'volume' est introuvable dans la réponse.");
      }
    })
    .catch((error) => (error.response ? error.response.data : "Erreur réseau"));
}

function getId(url) {
  return axios
    .get(url)
    .then((response) => {
      const json = response.data;
      if (Array.isArray(json) && json.length > 0 && json[0]._id !== undefined) {
        return json[0]._id;
      } else {
        throw new Error("Le champ '_id' est introuvable dans la réponse.");
      }
    })
    .catch((error) => (error.response ? error.response.data : "Erreur réseau"));
}

function envoyerDonnees(url, donnees) {
  return axios
    .post(url, donnees)
    .then((response) => response.data)
    .catch((error) => (error.response ? error.response.data : "Erreur réseau"));
}

function mettreAJourDonnees(url, donnees) {
  return axios
    .put(url, donnees)
    .then((response) => response.data)
    .catch((error) => (error.response ? error.response.data : "Erreur réseau"));
}

export {
  verifierExistence,
  getVolume,
  getId,
  envoyerDonnees,
  mettreAJourDonnees,
};
