import "./App.css";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Barcode from "react-barcode";
import axios from "axios";

function App() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("id");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [targetResponse, setTargetResponse] = useState(null);
    const [targetLoading, setTargetLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get("https://futug-server.vercel.app/api");
                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Произошла ошибка при выполнении запроса:", error);
            }
        }

        async function fetchItem() {
            try {
                const response = await axios.get("https://futug-server.vercel.app/api/" + id);
                setTargetResponse(response.data);
                setTargetLoading(false);
            } catch (error) {
                console.error("Произошла ошибка при выполнении запроса:", error);
            }
        }

        fetchData();
        if (id) {
            fetchItem();
        }
    }, [id]);

    console.log(targetResponse);

    if (!id) {
        return (
            <div>
                <p>Выберите ссылку:</p>
                {data?.map((item) => (
                    <a key={item.id} href={`http://localhost:5173/?id=${item.id}`}>
                        {item.id}
                    </a>
                ))}
            </div>
        );
    }

    return (
        <div>
            <h1>Баркод: {id}</h1>
            <Barcode value={id} />
            <p>Уровень: {targetResponse?.level}</p>
            <p>Всего покупок: {targetResponse?.currency}</p>
            <p>Общая сумма: {targetResponse?.total}</p>
        </div>
    );
}

export default App;
