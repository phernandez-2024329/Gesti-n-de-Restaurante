import MesaModel from '../models/mesa.model.js';

export const createMesaService = async (data) => {
    const {
        Table_id,
        Table_name,
        Table_Number,
        Table_Ubication,
        Table_Capacity,
        Table_time_available
    } = data;

    const mesa = new MesaModel({
        Table_id,
        Table_name,
        Table_Number,
        Table_Ubication,
        Table_Capacity,
        Table_time_available
    });
    return await mesa.save();
};

export const getMesasService = () => {
    return MesaModel.find({ estado: true });
};

export const getMesaByIdService = async (id) => {
    const mesa = await MesaModel.findById(id);

    if (!mesa || !mesa.estado) {
        return null;
    }

    return mesa;
};

export const searchMesaService = async (searchTerm) => {
    const numericTerm = Number(searchTerm);

    if (!isNaN(numericTerm)) {
        return await MesaModel.find({
            estado: true,
            Table_Number: numericTerm
        });
    }

    const resultsByName = await MesaModel.find({
        estado: true,
        Table_name: searchTerm
    });

    if (resultsByName.length > 0) {
        return resultsByName;
    }

    return await MesaModel.find({
        estado: true,
        Table_Ubication: searchTerm
    });
};

export const updateMesaService = async (id, data) => {
    return await MesaModel.findOneAndUpdate(
        { _id: id, estado: true },
        data,
        { new: true, runValidators: true }
    );
};

export const deleteMesaService = async (id) => {
    return await MesaModel.findOneAndUpdate(
        { _id: id },
        { estado: false },
        { new: true }
    );
}
