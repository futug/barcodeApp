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
    const [isShow, setIsShow] = useState(false);
    const [targetLoading, setTargetLoading] = useState(true);
    const targetId = targetResponse?.id.toString();

    const path = window.location.href;

    function showPopup() {
        setIsShow(true);
    }

    useEffect(() => {
        if (window.screen && screen.orientation && screen.orientation.lock) {
            screen.orientation.lock("portrait").catch(function (error) {
                console.error("Ошибка блокировки ориентации экрана:", error);
            });
        } else {
            console.log("Браузер или устройство не поддерживают блокировку ориентации экрана.");
        }
    }, []);

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

        if (id === undefined || id === null) {
            fetchData();
        }

        if (id) {
            fetchItem();
        }
    }, [id]);

    if (!id) {
        return (
            <div>
                <p>Выберите ссылку:</p>
                <div className="list__wrapper">
                    {data?.map((item) => (
                        <a key={item.id} href={`${path}?id=${item.id}`}>
                            {item.id}
                        </a>
                    ))}
                </div>
            </div>
        );
    }

    if (targetLoading) {
        return <div>Загружаем ваши бонусы</div>;
    }

    return (
        <div className="rootElem">
            <div className="app__wrapper container">
                <div className="app__header">
                    <div className="header__left">
                        <h1 className="header__title">Мои бонусы</h1>
                        <p className="header__subtitle">{targetResponse?.is_active ? "Активен" : "Не активен"}</p>
                    </div>
                    <div className="header__right">
                        <img
                            src={targetResponse?.avatar_img ? targetResponse?.avatar_img : "avatar.svg"}
                            alt="no avatar"
                            className={targetResponse?.avatar_img ? "header__avatar" : ""}
                        />
                    </div>
                </div>
                <section className="barcode">
                    <div className="barcode__group">
                        <Barcode
                            value={targetResponse ? targetId : "00000"}
                            background="transparent"
                            lineColor="#2A4BA0"
                            displayValue={false}
                            width={3.1}
                            height={153}
                            margin={0}
                        />
                        <div className="barcode__namelayer">
                            <p
                                className="barcode__title"
                                style={{ fontSize: targetResponse?.rest_name.length > 8 ? "24px" : targetResponse?.rest_name.length > 4 ? "36px" : "48px" }}
                            >
                                {targetResponse?.rest_name}
                            </p>
                        </div>
                    </div>
                </section>
                <footer className="customer__info">
                    <p className="customer__info-row">
                        Уровень: <span>{targetResponse?.level}</span>
                    </p>
                    <p className="customer__info-row">
                        Всего покупок: <span>{targetResponse?.currency}</span>
                    </p>
                    <p className="customer__info-row">
                        Общая сумма: <span>{targetResponse?.total}</span>
                    </p>
                    <div className="button__wrapper">
                        <button type="button" className="customer__info-button" onClick={showPopup}>
                            Get the bonus
                        </button>
                    </div>
                </footer>
                <div className="overlay" style={{ opacity: isShow ? "1" : "0" }}></div>
                <div className="popup" style={{ transform: isShow ? "translateX(0)" : "translateX(100%)" }} onClick={() => setIsShow(false)}>
                    <div className="popup__barcode">
                        <Barcode
                            value={targetResponse ? targetId : "00000"}
                            background="transparent"
                            lineColor="#2A4BA0"
                            displayValue={false}
                            width={4.8}
                            height={250}
                            margin={0}
                        />
                        <p
                            className="popup__barcode-title"
                            style={{ opacity: isShow ? "1" : "0", transform: isShow ? "translateX(0)" : "translateX(100%)", transitionDelay: "0.5s" }}
                        >
                            Тапните, что бы закрыть
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
