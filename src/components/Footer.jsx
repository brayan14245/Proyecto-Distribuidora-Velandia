import { MenuInferior } from "./MenuInferior";
import logoDV from '../assets/LogoDV.png';

export function Footer({ categorias = [], setCategoriaActiva }) {

    return (
        <>
        <footer className="app-footer">
        <div className="footer-inner">
          <div className="footer-brand-section">
            <div className="footer-brand">
              <img src={logoDV} alt="Distribuidora Velandia" className="brand-logo" />
              <span className="brand-name"><span className="brand-highlight">DV</span> Distribuidora</span>
            </div>
            <p className="footer-description">
              Distribuidora Velandia ofrece belleza, accesorios y artículos para regalo con estilo, calidad y atención para clientes exigentes.
            </p>
          </div>

          <div className="footer-links-group">
            <MenuInferior categorias={categorias} setCategoriaActiva={setCategoriaActiva}/>

            <div className="footer-column">
              <h4 className="footer-heading">Contacto & Horarios</h4>
              <p className="footer-info">📍 Bogotá - Colombia</p>
              <p className="footer-info">🕒 Lunes a Sábado: 8:00 AM - 6:00 PM</p>
              <p className="footer-info">📞 +57 300 000 0000</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Distribuidora Velandia. Todos los derechos reservados.</p>
        </div>
      </footer>
        </>
    );
}


    