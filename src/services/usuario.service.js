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

export const searchUsuarioService = async (searchTerm) => {
    const byUsername = await UsuarioModel.find({
        estado: true,
        username: searchTerm
    }).populate("pedidos").populate("comentarios");

    if (byUsername.length > 0) return byUsername;

    const byEmail = await UsuarioModel.find({
        estado: true,
        email: searchTerm
    }).populate("pedidos").populate("comentarios");

    if (byEmail.length > 0) return byEmail;

    return await UsuarioModel.find({
        estado: true,
        name: searchTerm
    }).populate("pedidos").populate("comentarios");
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


