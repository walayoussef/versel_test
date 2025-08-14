import React, { useState } from "react";
import { FaRecycle, FaLeaf, FaTrashAlt, FaFire } from "react-icons/fa";
import { jsPDF } from "jspdf";
import { ref, push, get, update } from "firebase/database";
import { database } from "../config";
import { useNavigate } from "react-router-dom";

const typesDechets = [
  { id: "inertes", label: "Déchets Inertes", icon: <FaTrashAlt color="#a1a1a1" /> },
  { id: "biodegradables", label: "Déchets Biodégradables", icon: <FaLeaf color="green" /> },
  { id: "recyclables", label: "Déchets Recyclables", icon: <FaRecycle color="blue" /> },
  { id: "combustibles", label: "Déchets Combustibles", icon: <FaFire color="red" /> },
];

export default function Commande() {
  const [quantites, setQuantites] = useState({
    inertes: 0,
    biodegradables: 0,
    recyclables: 0,
    combustibles: 0,
  });
  const [client, setClient] = useState("");
  const [adresse, setAdresse] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const navigate = useNavigate();

  const handleChange = (type, value) => {
    const parsedValue = parseInt(value);
    setQuantites({ ...quantites, [type]: isNaN(parsedValue) ? 0 : Math.max(0, parsedValue) });
  };

  const getTotal = () => Object.values(quantites).reduce((acc, val) => acc + val, 0);

  const handleSubmit = async () => {
    if (!client || !adresse || !email || !telephone || getTotal() === 0) {
      alert("Veuillez remplir tous les champs du client et choisir au moins un type de déchet.");
      return;
    }

    const date = new Date().toLocaleDateString("fr-FR");
    const heure = new Date().toLocaleTimeString("fr-FR");
    const dateMaj = `${date} ${heure}`;

    const dataCommande = {
      ...quantites,
      client,
      adresse,
      email,
      telephone,
      date,
      total: getTotal(),
    };

    try {
      const stockRef = ref(database, "stocks");
      const snapshot = await get(stockRef);
      const stockActuel = snapshot.val();

      if (!stockActuel) {
        alert("Erreur : aucun stock trouvé.");
        return;
      }

      for (const type in quantites) {
        const quantiteCommande = parseInt(quantites[type]) || 0;
        const quantiteDispo = parseInt(stockActuel[type]?.quantite) || 0;
        if (quantiteCommande > quantiteDispo) {
          alert(`Stock insuffisant pour ${type}. Stock disponible : ${quantiteDispo}`);
          return;
        }
      }

      for (const type in quantites) {
        const quantiteCommande = parseInt(quantites[type]) || 0;
        const quantiteDispo = parseInt(stockActuel[type]?.quantite) || 0;
        const nouvelleQuantite = quantiteDispo - quantiteCommande;

        await update(ref(database, `stocks/${type}`), {
          quantite: nouvelleQuantite,
          maj: dateMaj,
        });
      }

      await push(ref(database, "commandes"), dataCommande);
      generatePDF(dataCommande);
      alert("Commande enregistrée avec succès ! Le stock a été mis à jour.");

      setQuantites({ inertes: 0, biodegradables: 0, recyclables: 0, combustibles: 0 });
      setClient("");
      setAdresse("");
      setEmail("");
      setTelephone("");

      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      alert("Erreur lors du traitement : " + error.message);
    }
  };

  const generatePDF = (commande) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Facture de Commande", 70, 20);

    doc.setFontSize(12);
    doc.text(`Client : ${commande.client}`, 20, 40);
    doc.text(`Adresse : ${commande.adresse}`, 20, 50);
    doc.text(`Email : ${commande.email}`, 20, 60);
    doc.text(`Téléphone : ${commande.telephone}`, 20, 70);
    doc.text(`Date : ${commande.date}`, 20, 80);
    doc.text(`Total : ${commande.total} lot(s)`, 20, 90);
    const prixTotal = commande.total * 5;
    doc.text(`Prix total : ${prixTotal} DT`, 20, 100);


    doc.text("Détails :", 20, 110);
    let y = 120;
    for (const type of typesDechets) {
      const qty = commande[type.id];
      if (qty > 0) {
        doc.text(`- ${type.label} : ${qty} lot(s)`, 25, y);
        y += 10;
      }
    }

    doc.save(`facture_${commande.client}_${commande.date.replace(/\//g, "-")}.pdf`);
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>Commande de Déchets</h1>

      <div style={{ marginBottom: "15px" }}>
        <label>
          Nom du client :
          <input type="text" value={client} onChange={(e) => setClient(e.target.value)} style={{ marginLeft: "10px", padding: "5px", width: "200px" }} />
        </label>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>
          Adresse :
          <input type="text" value={adresse} onChange={(e) => setAdresse(e.target.value)} style={{ marginLeft: "10px", padding: "5px", width: "300px" }} />
        </label>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>
          Email :
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ marginLeft: "10px", padding: "5px", width: "250px" }} />
        </label>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>
          Téléphone :
          <input type="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)} style={{ marginLeft: "10px", padding: "5px", width: "200px" }} />
        </label>
      </div>

      <div style={{ marginTop: "30px" }}>
        {typesDechets.map((type) => (
          <div key={type.id} style={{ marginBottom: "15px", display: "flex", alignItems: "center" }}>
            {type.icon}
            <label style={{ marginLeft: "10px", width: "200px" }}>{type.label} :</label>
            <input type="number" min="0" value={quantites[type.id]} onChange={(e) => handleChange(type.id, e.target.value)} style={{ width: "60px", marginLeft: "10px" }} />
          </div>
        ))}
      </div>

      <h3>Total : {getTotal()} lot(s)</h3>

      <button onClick={handleSubmit} style={{ marginTop: "20px", padding: "10px 20px" }}>
        Confirmer la commande
      </button>
    </div>
  );
}
