import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import "../App.css";

// Images
import recyclageImg from "../assets/banner-bg.jpg";
import valorisationImg from "../assets/valorisation_image.jpg";
import inertesImg from "../assets/inertes_image.jpg";
import biodegradablesImg from "../assets/biodegradables_image.jpg";
import recyclablesImg from "../assets/recyclables_image.jpg";
import combustiblesImg from "../assets/combustibles_image.jpg";

const Accueil = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <main className="container mt-5">
      <h1 className="text-center mb-4" data-aos="fade-down" tabIndex="0">
        Bienvenue sur notre vitrine des déchets valorisables
      </h1>

      <p className="lead text-center" data-aos="fade-up" data-aos-delay="100">
        ♻️ Ce site est un <strong>projet porté par un jeune chercheur</strong>,
        pour promouvoir la gestion durable des déchets non dangereux
        et leur valorisation énergétique.
      </p>

      <blockquote
        className="text-center my-4 fst-italic"
        data-aos="fade-up"
        data-aos-delay="150"
        aria-label="Citation inspirante sur la valorisation des déchets"
      >
        "Transformer les déchets en énergie, c'est offrir une seconde vie à ce que l'on croyait perdu." <br />
        – Une vision durable pour un avenir renouvelable
      </blockquote>

      <section className="my-5">
        <h2 className="text-center mb-4" data-aos="fade-right" tabIndex="0">
          Nos services
        </h2>
        <div className="row text-center g-4">
          <article
            className="col-md-6 mb-4 card h-100 shadow-sm hover-card"
            data-aos="flip-left"
            data-aos-delay="200"
            tabIndex="0"
          >
            <img src={recyclageImg} className="card-img-top" alt="Recyclage des déchets" />
            <div className="card-body">
              <h3 className="card-title h5">Recyclage</h3>
              <p className="card-text">
                Transformer les déchets en nouveaux produits pour préserver les ressources naturelles.
              </p>
            </div>
          </article>

          <article
            className="col-md-6 mb-4 card h-100 shadow-sm hover-card"
            data-aos="flip-right"
            data-aos-delay="300"
            tabIndex="0"
          >
            <img src={valorisationImg} className="card-img-top" alt="Valorisation énergétique" />
            <div className="card-body">
              <h3 className="card-title h5">Valorisation Énergétique</h3>
              <p className="card-text">
                Produire électricité ou chaleur à partir de déchets biodégradables ou combustibles, vers une transition énergétique verte.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="my-5">
        <h2 className="text-center mb-4" data-aos="fade-left" tabIndex="0">
          Types de déchets
        </h2>
        <div className="row text-center g-4">
          {[
            {
              img: inertesImg,
              alt: "Déchets inertes",
              emoji: "🧱",
              title: "Déchets Inertes",
              desc: "Matériaux solides non recyclables (béton, briques...) qui ne subissent pas de dégradation.",
            },
            {
              img: biodegradablesImg,
              alt: "Déchets biodégradables",
              emoji: "🍃",
              title: "Déchets Biodégradables",
              desc: "Déchets organiques (restes alimentaires, feuilles, bois...) pouvant produire biogaz et électricité via méthanisation.",
            },
            {
              img: recyclablesImg,
              alt: "Déchets recyclables",
              emoji: "♻️",
              title: "Déchets Recyclables",
              desc: "Matériaux transformables en nouveaux produits (papier, plastique, verre). Valorisation matière.",
            },
            {
              img: combustiblesImg,
              alt: "Déchets combustibles",
              emoji: "🔥",
              title: "Déchets Combustibles",
              desc: "Déchets à haut pouvoir calorifique utilisables pour produire énergie renouvelable par incinération contrôlée.",
            },
          ].map(({ img, alt, emoji, title, desc }, i) => (
            <article
              key={i}
              className="col-md-3 card-dechet p-3 shadow-sm hover-card"
              data-aos="zoom-in"
              data-aos-delay={300 + i * 100}
              tabIndex="0"
              aria-label={title}
            >
              <img src={img} alt={alt} className="image-dechets mb-2 rounded" />
              <p className="fs-5">
                {emoji} <strong>{title}</strong>
              </p>
              <p className="description">{desc}</p>
            </article>
          ))}
        </div>

        <div className="text-center my-5" data-aos="fade-up" data-aos-delay="700">
          <Link to="/produits" className="btn btn-success btn-lg shadow-sm hover-button" aria-label="Passer une commande">
            🛒 Passer une commande
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Accueil;
