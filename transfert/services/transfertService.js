const http = require("http");
const https = require("https");

function verifierExistance(url) {
  return new Promise(function (resolve, reject) {
    const lib = url.startsWith("https") ? https : http;
    const req = lib.get(url, function (res) {
      if (res.statusCode === 200) {
        resolve(true);
      } else {
        resolve(false);
      }
    });

    req.on("error", function (err) {
      reject(err);
    });

    req.end();
  });
}

function getVolume(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;

    const req = lib.get(url, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          console.log(data);
          if (
            Array.isArray(json) &&
            json.length > 0 &&
            json[0].volume !== undefined
          ) {
            resolve(json[0].volume);
          } else {
            reject(
              new Error("Le champ 'volume' est introuvable dans la réponse.")
            );
          }
        } catch (err) {
          reject(new Error("Erreur lors de l'analyse JSON : " + err.message));
        }
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    req.end();
  });
}

function getId(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;

    const req = lib.get(url, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          if (
            Array.isArray(json) &&
            json.length > 0 &&
            json[0]._id !== undefined
          ) {
            resolve(json[0]._id);
          } else {
            reject(
              new Error("Le champ '_id' est introuvable dans la réponse.")
            );
          }
        } catch (err) {
          reject(new Error("Erreur lors de l'analyse JSON : " + err.message));
        }
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    req.end();
  });
}

function envoyerDonnees(url, donnees) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;

    const dataString = JSON.stringify(donnees);
    console.log(dataString);

    const req = lib.request(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(dataString),
        },
      },
      (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (err) {
            reject(new Error("Erreur lors de l'analyse JSON : " + err.message));
          }
        });
      }
    );

    req.on("error", (err) => {
      reject(err);
    });

    req.write(dataString);
    req.end();
  });
}

function mettreAJourDonnees(url, donnees) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;

    const dataString = JSON.stringify(donnees);
    console.log(dataString);

    const req = lib.request(
      url,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(dataString),
        },
      },
      (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (err) {
            reject(new Error("Erreur lors de l'analyse JSON : " + err.message));
          }
        });
      }
    );

    req.on("error", (err) => {
      reject(err);
    });

    req.write(dataString);
    req.end();
  });
}

module.exports = {
  verifierExistance,
  getVolume,
  getId,
  envoyerDonnees,
  mettreAJourDonnees,
};
