import Notification from '../models/notification.model.js';

export const createNotification = async (req, res) => {
    try {
        const { title, message, user_id } = req.body;

        if (!title || !message || !user_id) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos obligatorios: title, message, user_id'
            });
        }

        const notification = new Notification({
            title,
            message,
            user_id
        });

        await notification.save();

        res.status(201).json({
            success: true,
            message: 'Notificación creada exitosamente',
            notification
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear la notificación',
            error: error.message
        });
    }
};

export const getNotifications = async (req, res) => {
    try {
        const { user_id } = req.query;

        let filter = { estado: true };
        if (user_id) {
            filter.user_id = user_id;
        }

        const notifications = await Notification.find(filter)
            .populate('user_id', 'nombre email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            notifications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener las notificaciones',
            error: error.message
        });
    }
};

export const updateNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const { title, message, isRead } = req.body;

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (message !== undefined) updateData.message = message;
        if (isRead !== undefined) updateData.isRead = isRead;

        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            updateData,
            { new: true }
        ).populate('user_id', 'nombre email');

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notificación no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Notificación actualizada exitosamente',
            notification
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la notificación',
            error: error.message
        });
    }
};

export const deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;

        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { estado: false },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notificación no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Notificación eliminada exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la notificación',
            error: error.message
        });
    }
};