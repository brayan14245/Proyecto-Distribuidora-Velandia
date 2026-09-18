export function Menu({categorias, onSelectCategoria, categoriaActiva}) {
    const categoriasValidas = (categorias || []).filter((cat) => {
        const nombreCat = (cat?.nombre || cat?.label || '').toString().trim();
        return nombreCat !== '';
    });

    const categoriasMostradas = [{ id: 'inicio', nombre: 'Inicio' }, ...categoriasValidas.filter((cat) => {
        const nombreCat = (cat?.nombre || cat?.label || '').toString().trim();
        return nombreCat.toLowerCase() !== 'inicio';
    })];

    return (
        <>
            <nav className="nav-categories">
            {categoriasMostradas.map((cat) => {
                const nombreCat = cat.nombre || cat.label;
                return (
                    <button
                        key={cat.id || nombreCat}
                        className={`category-pill ${categoriaActiva === nombreCat ? 'active' : ''}`}
                        onClick={() => onSelectCategoria(nombreCat)}
                    >
                        {nombreCat}
                    </button>
                );
            })}
            </nav>
        </>
    );
}


    