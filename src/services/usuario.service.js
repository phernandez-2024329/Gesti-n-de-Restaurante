import UsuarioModel  from "../models/usuario.model.js";

export const createUsuarioService = async (data) => {
    const { name, surname, username, email, user_age, password } = data;

    const usuario = new UsuarioModel({
        name,
        surname,
        username,
        email,
        user_age,
        password
    });

    return await usuario.save();
};

export const getUsuariosService = async () => {
    return await UsuarioModel.find({ estado: true })
        .populate("pedidos")
        .populate("comentarios");
};

export const getUsuarioByIdService = async (id) => {
    return await UsuarioModel.findOne({ _id: id, estado: true })
        .populate("pedidos")
        .populate("comentarios");
};

export const searchUsuarioService = async (criterio) => {
    const { username, email, name } = criterio;
    
    const filtro = { estado: true };
    
    if (username) filtro.username = { $regex: username, $options: 'i' };
    if (email) filtro.email = { $regex: email, $options: 'i' };
    if (name) filtro.name = { $regex: name, $options: 'i' };
    
    return await UsuarioModel.find(filtro)
        .populate("pedidos")
        .populate("comentarios");
};

export const updateUsuarioService = async (id, data) => {
    return await UsuarioModel.findOneAndUpdate(
        { _id: id, estado: true },
        data,
        { new: true }
    );
};

export const deleteUsuarioService = async (id) => {
    return await UsuarioModel.findOneAndUpdate(
        { _id: id },
        { estado: false },
        { new: true }
    )
}


