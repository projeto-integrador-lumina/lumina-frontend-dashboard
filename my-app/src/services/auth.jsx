import axios from "axios";

export const getAxiosConfig = () => ({
    headers: {
        Authorization: `Bearer ${
            typeof window!== "undefined" ? (localStorage.getItem("token") ?? "") : ""
        }`
    }
});

//realiza o login
export const login = async (usuario, senha) => {
    try {
        const response = await axios.post("http://localhost:4000/api/auth/login", {
            usuario, 
            senha
        });
        const token = response.data.token;
        localStorage.setItem("token", token);
        return {success : true};
    } catch (error) {
        return {success : false, message: error.message};
    }
};

export const logout = (router) => {
    localStorage.removeItem("token");
    router.push("/");
};