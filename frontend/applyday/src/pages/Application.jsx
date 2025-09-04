import React, { useState, useEffect } from "react";
import ApplicationForm from "../components/ApplicationForm";
import ApplicationItem from "../components/ApplicationItem";
import { AnimatePresence, motion } from "framer-motion";
import Dashboard from "../components/Dashboard";

import {
  fetchApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  getApplication,
} from "../service/application";

const ApplicationManager = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    job_title: "",
    job_description: "",
    status: "applied",
    stage_notes: "",
  });

  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await fetchApplications();
      setApplications(data);
    } catch (error) {
      console.error("Failed to load applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  // 添加ESC键支持关闭模态
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showCreateForm) {
        handleCancel();
      }
    };

    if (showCreateForm) {
      document.addEventListener('keydown', handleEscape);
      // 防止背景滚动
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showCreateForm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createApplication(formData);
      setFormData({
        company: "",
        job_title: "",
        job_description: "",
        status: "applied",
        stage_notes: "",
      });
      setShowCreateForm(false);
      await loadApplications();
    } catch (error) {
      console.error("Failed to create application:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const application = await getApplication(id);
      setFormData({
        company: application.company || "",
        job_title: application.job_title || "",
        job_description: application.apply_description?.[0]?.text || "",
        status: application.status || "applied",
        stage_notes: application.stage_notes || "",
      });
      setEditingId(id);
    } catch (error) {
      console.error("Failed to fetch application for editing:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateApplication(editingId, formData);
      setEditingId(null);
      setFormData({
        company: "",
        job_title: "",
        job_description: "",
        status: "applied",
        stage_notes: "",
      });
      await loadApplications();
    } catch (error) {
      console.error("Failed to update application:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure deleting this record?")) {
      setLoading(true);
      try {
        await deleteApplication(id);
        await loadApplications();
      } catch (error) {
        console.error("Failed to delete application:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowCreateForm(false);
    setFormData({
      company: "",
      job_title: "",
      job_description: "",
      status: "applied",
      stage_notes: "",
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Application Manager
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your job applications and track your progress
        </p>
      </div>

      {/* 创建按钮 */}
      <div className="mb-6">
        <button
          onClick={() => setShowCreateForm(true)}
          disabled={loading || showCreateForm || editingId}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors duration-200 font-medium"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Application
        </button>
      </div>
            {/* Dashboard */}
      <div className="w-full max-w-6xl px-4">
        <Dashboard />
      </div>
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            key="create-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
            onClick={handleCancel}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-lg">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Create New Application
                </h2>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="px-6 pb-6">
                <ApplicationForm
                  onCancel={handleCancel}
                  onCreate={handleCreate}
                  onChange={handleInputChange}
                  formData={formData}
                  loading={loading}
                  isModal={true}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 申请列表 */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Application List
          </h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
            {applications.length} applications
          </span>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading applications...</span>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">📝</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No applications yet</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">Create your first application to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
              >
                {editingId === application.id ? (
                  <ApplicationForm
                    onCancel={handleCancel}
                    onCreate={handleUpdate}
                    onChange={handleInputChange}
                    formData={formData}
                    loading={loading}
                  />
                ) : (
                  <ApplicationItem
                    showCreateForm={showCreateForm}
                    editingId={editingId}
                    loading={loading}
                    application={application}
                    handleDelete={handleDelete}
                    handleEdit={handleEdit}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationManager;
