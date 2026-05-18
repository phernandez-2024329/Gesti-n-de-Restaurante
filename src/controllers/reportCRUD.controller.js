import Report from '../models/report.model.js';
import Audit from '../models/audit.model.js';

const makeAudit = async ({ action, resource, resourceId, user, before, after, details }) => {
  try {
    await Audit.create({ action, resource, resourceId, user, before, after, details });
  } catch (err) {
    console.error('Error creating audit entry', err.message);
  }
};

export const listReports = async (req, res) => {
  try {
    const user = req.user || {};
    const filter = { $or: [{ 'owner.id': user.id }, { shared: true }] };
    const reports = await Report.find(filter).sort({ updatedAt: -1 });
    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error listing reports', error: error.message });
  }
};

export const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findById(id);
    if (!report) return res.status(404).json({ success: false, message: 'Reporte no encontrado' });
    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error obteniendo reporte', error: error.message });
  }
};

export const createReport = async (req, res) => {
  try {
    const user = req.user || {};
    const payload = req.body || {};
    const doc = {
      title: payload.title,
      description: payload.description,
      type: payload.type || 'custom',
      status: payload.status || 'draft',
      period: payload.period || payload.periodo,
      query: payload.query,
      owner: {
        id: user.id,
        role: user.role,
        name: payload.ownerName || user.id || '',
        username: user.username || ''
      },
      shared: !!payload.shared
    };
    const report = await Report.create(doc);
    await makeAudit({ action: 'CREAR_REPORTE', resource: 'Report', resourceId: report._id?.toString(), user: { id: user.id, role: user.role, name: payload.ownerName || '' }, after: report });
    res.status(201).json({ success: true, message: 'Reporte creado', report });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creando reporte', error: error.message });
  }
};

export const updateReport = async (req, res) => {
  try {
    const user = req.user || {};
    const { id } = req.params;
    const payload = req.body || {};
    const before = await Report.findById(id);
    if (!before) return res.status(404).json({ success: false, message: 'Reporte no encontrado' });
    
    // Only allow updating specific fields
    const updateData = {};
    if (payload.title) updateData.title = payload.title;
    if (payload.description !== undefined) updateData.description = payload.description;
    if (payload.type) updateData.type = payload.type;
    if (payload.status) updateData.status = payload.status;
    if (payload.period !== undefined) updateData.period = payload.period || payload.periodo;
    if (payload.query) updateData.query = payload.query;
    if (payload.shared !== undefined) updateData.shared = payload.shared;
    
    const updated = await Report.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    await makeAudit({ action: 'EDITAR_REPORTE', resource: 'Report', resourceId: id, user: { id: user.id, role: user.role, name: user.name || '' }, before, after: updated });
    res.json({ success: true, message: 'Reporte actualizado', report: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error actualizando reporte', error: error.message });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const user = req.user || {};
    const { id } = req.params;
    const before = await Report.findById(id);
    if (!before) return res.status(404).json({ success: false, message: 'Reporte no encontrado' });
    await Report.findByIdAndDelete(id);
    await makeAudit({ action: 'ELIMINAR_REPORTE', resource: 'Report', resourceId: id, user: { id: user.id, role: user.role, name: user.name || '' }, before });
    res.json({ success: true, message: 'Reporte eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error eliminando reporte', error: error.message });
  }
};
