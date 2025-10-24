import { faCalendarAlt, faChartBar, faFilm, faImage, faMapMarkedAlt, faSmile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import PropTypes from "prop-types";
import api from "../../services/api";

export function TwitterForm({ onTweet, categories }) {
    const textAreaRef = useRef();
    const [selectedCategory, setSelectedCategory] = useState("");
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async (file) => {
        setUploading(true);
        try {
            const response = await api.uploadImage(file);
            setImage(response.url);
        } catch (error) {
            console.error("Erro no upload:", error);
        } finally {
            setUploading(false);
        }
    };

    function handleSubmit() {
        if (textAreaRef.current.value) {
            onTweet(textAreaRef.current.value, selectedCategory, image);
            textAreaRef.current.value = '';
            setSelectedCategory("");
            setImage(null);
        }
    }

    const handleImageClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                handleImageUpload(file);
            }
        };
        input.click();
    };

    return (
        <div className="border-b border-gray-800 p-4">
            <textarea
                className="w-full bg-transparent text-white text-xl resize-none outline-none"
                placeholder="O que você estudou hoje?"
                ref={textAreaRef}
            />
            {categories && categories.length > 0 && (
                <div className="mt-2">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="bg-gray-700 text-white rounded px-2 py-1 text-sm"
                    >
                        <option value="">Selecione uma categoria</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.nome}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            {image && (
                <div className="mt-2">
                    <img src={image} alt="Preview" className="max-w-full h-32 object-cover rounded" />
                </div>
            )}
            <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-4">
                    <FontAwesomeIcon
                        icon={faImage}
                        className="text-blue-400 cursor-pointer hover:text-blue-300"
                        onClick={handleImageClick}
                        title="Adicionar imagem"
                    />
                    <FontAwesomeIcon icon={faFilm} className="text-blue-400 cursor-pointer hover:text-blue-300" />
                    <FontAwesomeIcon icon={faChartBar} className="text-blue-400 cursor-pointer hover:text-blue-300" />
                    <FontAwesomeIcon icon={faSmile} className="text-blue-400 cursor-pointer hover:text-blue-300" />
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-400 cursor-pointer hover:text-blue-300" />
                    <FontAwesomeIcon icon={faMapMarkedAlt} className="text-blue-400 cursor-pointer hover:text-blue-300" />
                </div>
                <button
                    className="bg-blue-400 text-white font-bold px-4 py-2 rounded-full hover:bg-blue-600 transition duration-200 disabled:opacity-50"
                    onClick={handleSubmit}
                    disabled={uploading}
                >
                    {uploading ? "Enviando..." : "Postar"}
                </button>
            </div>
        </div>
    );
}

TwitterForm.propTypes = {
    onTweet: PropTypes.func.isRequired,
    categories: PropTypes.array,
};
