"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

type Player = {
  rank: string;
  name: string;
  score: string;
};

function Leaderboard() {
  const [eastPlayers, setEastPlayers] = useState<Player[]>([]);
  const [westPlayers, setWestPlayers] = useState<Player[]>([]);

  const fetchCSVData = async (url: string, setData: React.Dispatch<React.SetStateAction<Player[]>>) => {
    try {
      const response = await axios.get(url);
      const data = response.data.split("\n").slice(1); // Ignore the header row
      const playersData = data
        .filter((row: string) => row.trim() !== "") // Ignore empty rows
        .map((row: string) => {
          const [rank, name, score] = row.split(",");
          return { rank, name, score: parseFloat(score).toFixed(2) };
        });
      setData(playersData);
    } catch (error) {
      console.error(`Erreur lors du chargement de ${url}:`, error);
    }
  };

  useEffect(() => {
    fetchCSVData("/all.csv", setEastPlayers);
    fetchCSVData("/ouest.csv", setWestPlayers);
  }, []);

  const renderTable = (title: string, players: Player[]) => (
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
            <tr key={player.rank} className="hover:bg-gray-100">
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
      <h1 className="text-3xl font-bold text-center mb-8">Classements</h1>
      <div className="flex flex-wrap -mx-4">
        {renderTable("Conférence Est", eastPlayers)}
        {renderTable("Conférence Ouest", westPlayers)}
      </div>
    </div>
  );
}

export default Leaderboard;
