import { useLocation } from "react-router-dom";
import Barcode from "react-barcode";

const BarcodeComp = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("id");

    console.log(id);
    console.log(location);
    if (!id) {
        return <div>Ошибка: ID не найден в URL.</div>;
    }
    return (
        <div>
            <h1>Баркод для ID: {id}</h1>
            <Barcode value={id} />
        </div>
    );
};

export default BarcodeComp;
