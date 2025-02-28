import axios from "axios";
import { IResult, IVerifResponse } from "../models/serviceResponseInterface";
import { IStockage } from "../models/stockageModel";

async function verifIfExist(urls: string[]): Promise<IVerifResponse> {
  const results: IResult[] = await Promise.all(
    urls.map(async (url) => {
      try {
        const response = await axios.get(url);
        return { url, status: response.status, error: null };
      } catch (error: any) {
        return {
          url,
          status: error.response ? error.response.status : null,
          error: error.response ? error.response.data : "Erreur réseau",
        };
      }
    })
  );

  const erreurs = results.filter((res) => res.error !== null);

  return {
    success: erreurs.length === 0,
    errors: erreurs.length > 0 ? erreurs : null,
  };
}

async function checkQuantite(url: string, vol: number): Promise<boolean> {
  const result: IStockage = await axios.get(url);
  if (result.volume < vol) {
    return false;
  }
  return true;
}

async function updateData(urlId: string, urlPut: string, vol: number) {
  try {
    const objToUpdate: IStockage = await axios.get(urlId);
    const dataToUpate = await axios.put<IStockage>(
      `${urlPut}/${objToUpdate._id}`,
      {
        id_magasin: objToUpdate.id_magasin,
        id_marchandise: objToUpdate.id_marchandise,
        volume: objToUpdate.volume - vol,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return {
      success: true,
      message: "Stockage mis à jour avec succès",
      data: dataToUpate,
    };
  } catch (error) {
    return {
      success: false,
      message: "Erreur lors de mis à jour de la donnée",
    };
  }
}

export { verifIfExist, checkQuantite, updateData };
