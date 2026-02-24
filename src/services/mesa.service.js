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
    const query = {
        estado: true,
        $or: [
            { Table_Number: Number(searchTerm) || -1 },
            { Table_name: { $regex: searchTerm, $options: 'i' } },
            { Table_Ubication: { $regex: searchTerm, $options: 'i' } }
        ]
    };
    if (isNaN(Number(searchTerm))) {
        query.$or = query.$or.filter(cond => !cond.Table_Number);
    }
    return await MesaModel.find(query);
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
