export function MenuInferior({ categorias = [], setCategoriaActiva }) {
    const listaCategorias = (categorias || []).filter((cat) => {
        const nombreCat = (cat?.nombre || cat?.label || '').toString().trim();
        return nombreCat !== '';
    });

    return (
        <>
        <div className="footer-column">
              <h4 className="footer-heading">Categorías</h4>
              <ul className="footer-list">
                {[{ id: 'inicio', nombre: 'Inicio' }, ...listaCategorias.filter((cat) => {
                    const nombreCat = (cat?.nombre || cat?.label || '').toString().trim();
                    return nombreCat.toLowerCase() !== 'inicio';
                })].map((cat) => {
                    const nombreCat = cat.nombre || cat.label;
                    return (
                        <li key={cat.id || nombreCat}>
                            <button onClick={() => setCategoriaActiva(nombreCat)}>
                                {nombreCat}
                            </button>
                        </li>
                    );
                })}
              </ul>
            </div>
        </>
    );
}


    