import CryptoJS from "crypto-js";

export const GetAvatar = (email) => {
    const hash = CryptoJS.MD5(email.trim().toLowerCase()).toString();
    return `https://www.gravatar.com/avatar/${hash}?s=40&d=identicon`;
};

export const GetRandomImage = () => {
    return `https://picsum.photos/600/400?random=${Math.random()}`;
};
