import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';

const Pagination = ( { count } ) => {
    const [ searchParams ] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();

    const page = parseInt( searchParams.get( 'page' ) ) || 1;
    const ITEMS_PER_PAGE = 2;

    const hasPrev = ITEMS_PER_PAGE * ( page - 1 ) > 0;
    const hasNext = ITEMS_PER_PAGE * ( page - 1 ) + ITEMS_PER_PAGE < count;

    const handleChangePage = ( type ) => {
        const params = new URLSearchParams( searchParams );
        if ( type === 'prev' )
        {
            params.set( 'page', page - 1 );
        } else
        {
            params.set( 'page', page + 1 );
        }
        navigate( `${ location.pathname }?${ params.toString() }` );
    };

    return (
        <div className="p-2 flex justify-between">
            <button
                className="bg-black text-white rounded-md py-1 px-2 disabled:cursor-not-allowed disabled:text-gray-500"
                disabled={ !hasPrev }
                onClick={ () => handleChangePage( 'prev' ) }
            >
                Previous
            </button>
            <button
                className="bg-black text-white py-1 px-2 rounded-md disabled:cursor-not-allowed disabled:text-gray-500"
                disabled={ !hasNext }
                onClick={ () => handleChangePage( 'next' ) }
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;