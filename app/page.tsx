"use client";

import { useState, useEffect } from "react";
import axios from "axios";

type Player = {
  rank: string;
  name: string;
  score: string;
};

export default function Home() {
  const [eastPlayers, setEastPlayers] = useState<Player[]>([]);
  const [westPlayers, setWestPlayers] = useState<Player[]>([]);

  // Fonction pour charger les données d'un fichier CSV
  const fetchCSVData = async (url: string, setData: React.Dispatch<React.SetStateAction<Player[]>>) => {
    try {
      const response = await axios.get(url);
      const rows = response.data.split("\n").slice(1); // Supprime la ligne d'en-tête
      const players = rows
        .filter((row: string) => row.trim() !== "") // Ignore les lignes vides
        .map((row: string) => {
          const [rank, name, score] = row.split(",");
          return { rank, name, score: parseFloat(score).toFixed(2) };
        });
      setData(players);
    } catch (error) {
      console.error(`Erreur lors du chargement de ${url}:`, error);
    }
  };

  // Charger les données des deux fichiers CSV au montage du composant
  useEffect(() => {
    fetchCSVData("/all.csv", setEastPlayers);
    fetchCSVData("/ouest.csv", setWestPlayers);
  }, []);

  // Fonction pour définir la classe CSS en fonction du nom
  const getRowClass = (name: string, conference: "east" | "west") => {
    const neonYellow = "bg-yellow-500 text-black font-bold"; // Jaune fluo
    const yellow = "bg-yellow-400 text-black"; // Jaune
    const gray = "bg-blue-400 text-black"; // Gris

    if (conference === "east") {
      if (name === "Akoa") return neonYellow;
      if (["Clarke", "Bankole", "Leite", "Franchelin"].includes(name)) return yellow;
      if (
        [
          "Malonga",
          "Bernies",
          "Mdnijadeu",
          "Quevedo",
          "Peters",
          "Enabosi",
          "Bone",
        ].includes(name)
      )
        return gray;
    }

    if (conference === "west") {
      if (name === "Diaby") return neonYellow;
      if (["Astier", "Alston", "Luisa", "Musa"].includes(name)) return yellow;
      if (
        [
          "Droguet",
          "Okokwo",
          "Green",
          "Spannou",
          "Woolfok",
          "Clarince",
          "Akhator",
        ].includes(name)
      )
        return gray;
    }

    return ""; // Pas de style spécial
  };

  // Fonction pour afficher un tableau
  const renderTable = (title: string, players: Player[], conference: "east" | "west") => (
    <div className="w-full lg:w-1/2 p-4">
      <h2 className="text-2xl font-bold text-center mb-4">{title}</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Rang</th>
            <th className="px-4 py-2 border">Nom</th>
            <th className="px-4 py-2 border">Score</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.rank} className={`hover:bg-gray-100 ${getRowClass(player.name, conference)}`}>
              <td className="px-4 py-2 border text-center">{player.rank}</td>
              <td className="px-4 py-2 border">{player.name}</td>
              <td className="px-4 py-2 border text-center">{player.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-8">All Star LFB</h1>
      <div className="flex flex-wrap -mx-4">
        {renderTable("Conférence Est", eastPlayers, "east")}
        {renderTable("Conférence Ouest", westPlayers, "west")}
      </div>
    </div>
  );
}
