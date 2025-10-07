import { faCalendarAlt, faChartBar, faFilm, faImage, faMapMarkedAlt, faSmile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";

export function TwitterForm({onTweet}) {
    const textAreaRef = useRef()


    function handSubmit() {

        if(textAreaRef.current.value) {
        onTweet(textAreaRef.current.value)
        textAreaRef.current.value = ''
        }
    }

    return (
        <div className="border-b border-gray-800 p-4">
            <textarea
            className="w-full bg-transparent text-white text-xl resize-none outline-none"  
            placeholder="oque voce estudou?"
            ref={textAreaRef}
            />
            <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-4">
                    <FontAwesomeIcon icon={ faImage } className="text-blue-400 cursor-pointer"/>
                    <FontAwesomeIcon icon={ faFilm } className="text-blue-400 cursor-pointer"/>
                    <FontAwesomeIcon icon={ faChartBar } className="text-blue-400 cursor-pointer"/>
                    <FontAwesomeIcon icon={ faSmile } className="text-blue-400 cursor-pointer"/>
                    <FontAwesomeIcon icon={ faCalendarAlt } className="text-blue-400 cursor-pointer"/>
                    <FontAwesomeIcon icon={ faMapMarkedAlt } className="text-blue-400 cursor-pointer"/>
                </div>
                <button className="bg-blue-400 text-white font-bold px-4 py-2 rounded-full hover:bg-blue-600 transition duration-200" onClick={handSubmit}>tweet</button>
            </div>
        </div>
    )
}   