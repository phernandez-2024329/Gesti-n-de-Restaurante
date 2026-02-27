import DetallePedidoModel from "../models/DetallePedido.model.js";

export const createDetallePedidoService = async (data) => {
  const { pedido, producto, candidadproducto, preciounitario } = data;

  const total = candidadproducto * preciounitario;

  const detallePedido = new DetallePedidoModel({
    pedido,
    producto,
    candidadproducto,
    preciounitario,
    total
  });

  return await detallePedido.save();
};

export const  getDetallePedidosService = async () => {
  return await DetallePedidoModel.find({ estado: true })
    .populate("pedido")
    .populate("producto");
};

export const getDetallePedidoByIdService = async (id) => {
  return await DetallePedidoModel.findOne({ _id: id, estado: true })
    .populate("pedido")
    .populate("producto");
};

export const updateDetallePedidoService = async (id, data) => {
  if (data.candidadproducto && data.preciounitario) {
    data.total = data.candidadproducto * data.preciounitario;
  }

  return await DetallePedidoModel.findOneAndUpdate(
    { _id: id, estado: true },
    data,
    { new: true }
  );
};

export const deleteDetallePedidoService = async (id) => {
  return await DetallePedidoModel.findOneAndUpdate(
    { _id: id },
    { estado: false },
    { new: true }
  );
};
