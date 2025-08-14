import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase/config";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { Loader2, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const typesDechets = [
  {
    key: "biodegradables",
    label: "Biodégradables",
    img: "/images/biodegradables_image.jpg",
  },
  {
    key: "recyclables",
    label: "Recyclables",
    img: "/images/recyclables_image.jpg",
  },
  {
    key: "combustibles",
    label: "Combustibles",
    img: "/images/combustibles_image.jpg",
  },
  {
    key: "inertes",
    label: "Inertes",
    img: "/images/inertes_image.jpg",
  },
];

const Produits = () => {
  const [stocks, setStocks] = useState({});
  const [filtreActif, setFiltreActif] = useState("tous");
  const [chargement, setChargement] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    NProgress.start();
    const stocksRef = ref(database, "stocks");
    const unsubscribe = onValue(stocksRef, (snapshot) => {
      if (snapshot.exists()) {
        setStocks(snapshot.val());
      } else {
        setStocks({});
      }
      setChargement(false);
      NProgress.done();
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 px-4 sm:px-10 py-10">
      <h1 className="text-4xl font-extrabold text-center text-green-800 mb-12 tracking-tight">
        ♻️ <span className="underline decoration-green-400">Produits disponibles</span>
      </h1>

      {/* Filtres */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {["tous", ...typesDechets.map((t) => t.key)].map((type) => {
          const active = filtreActif === type;
          return (
            <button
              key={type}
              onClick={() => setFiltreActif(type)}
              className={`px-5 py-2 rounded-full border transition-all duration-300 font-medium shadow-md hover:scale-105 ${
                active
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-green-700 border-green-300"
              }`}
            >
              {type === "tous"
                ? "Tous les types"
                : typesDechets.find((t) => t.key === type)?.label}
            </button>
          );
        })}
      </div>

      {/* Grille des produits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {typesDechets
          .filter(({ key }) => filtreActif === "tous" || filtreActif === key)
          .map(({ key, label, img }) => (
            <div
              key={key}
              className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transform transition-transform duration-300 hover:-translate-y-1"
            >
              <img
                src={img}
                alt={label}
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-5">
                <h2 className="text-xl font-bold text-green-800 mb-2">{label}</h2>
                <p className="text-gray-600">
                  Quantité disponible :
                  <span className="ml-1 font-semibold text-green-700">
                    {chargement ? (
                      <Loader2 className="inline animate-spin" />
                    ) : (
                      stocks[key]?.quantite ?? "0"
                    )}{" "}
                    lots
                  </span>
                </p>
              </div>
            </div>
          ))}
      </div>

      {/* Bouton commander */}
      <div className="flex justify-center mt-14">
        <button
          onClick={() => navigate("/commande")}
          className="flex items-center gap-3 bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <ShoppingCart size={22} />
          Passer ma commande
        </button>
      </div>
    </div>
  );
};

export default Produits;

