import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  FileText,
  Edit3,
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Pin,
  Tag,
  Folder,
  Clock,
} from "lucide-react";
import api from "../../services/api";
import useNotification from "../../hooks/useNotification";
import NoteModal from "./NoteModal";
import DeleteNoteModal from "./DeleteNoteModal";
import useAuth from "../../hooks/useAuth";

const getAccessNames = (values) => {
  const entries = Array.isArray(values)
    ? values
    : values == null
      ? []
      : [values];
  return entries
    .map((entry) => (typeof entry === "string" ? entry : entry?.name))
    .filter((name) => typeof name === "string" && name.trim())
    .map((name) => name.trim().toLowerCase());
};

const NoteList = () => {
  const { user, roles = [], permissions = [] } = useAuth();
  const userRoles = [
    ...getAccessNames(roles),
    ...getAccessNames(user?.roles ?? user?.role),
  ].map((role) => role.replace(/[_-]+/g, " "));
  const isAdmin = userRoles.some((role) =>
    ["admin", "super admin", "superadmin"].includes(role),
  );
  const userPermissions = [
    ...getAccessNames(permissions),
    ...getAccessNames(user?.permissions),
  ];

  const hasPermission = (permission) =>
    isAdmin || userPermissions.includes(permission.trim().toLowerCase());

  const canViewNotes = hasPermission("notes.view");
  const canCreateNotes = hasPermission("notes.create");
  const canUpdateNotes = hasPermission("notes.update");
  const canDeleteNotes = hasPermission("notes.delete");

  const { showSuccess, showError } = useNotification();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalNotes, setTotalNotes] = useState(0);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchNotes = useCallback(
    async (page = 1, search = "", category = "") => {
      if (!canViewNotes) {
        setNotes([]);
        setTotalNotes(0);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await api.get("/notes", {
          params: { page, search, category, per_page: 9 },
        });

        const responseData = response.data?.data;

        if (responseData?.data && Array.isArray(responseData.data)) {
          setNotes(responseData.data);
          setCurrentPage(responseData.current_page || 1);
          setLastPage(responseData.last_page || 1);
          setTotalNotes(responseData.total || responseData.data.length);
        } else if (Array.isArray(responseData)) {
          setNotes(responseData);
          setTotalNotes(responseData.length);
        } else {
          setNotes([]);
        }
      } catch (err) {
        showError("មិនអាចទាញយកទិន្នន័យ Notes បានឡើយ");
      } finally {
        setLoading(false);
      }
    },
    [canViewNotes, showError],
  );

  useEffect(() => {
    fetchNotes(currentPage, searchQuery, categoryFilter);
  }, [fetchNotes, currentPage, categoryFilter]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);
    fetchNotes(1, value, categoryFilter);
  };

  const handleSaveNote = async (formData) => {
    setActionLoading(true);
    try {
      if (selectedNote) {
        await api.put(`/notes/${selectedNote.id}`, formData);
        showSuccess("បានកែប្រែ Note រួចរាល់", "កែប្រែជោគជ័យ");
      } else {
        await api.post("/notes", formData);
        showSuccess("បានបង្កើត Note ថ្មីដោយជោគជ័យ", "បង្កើតជោគជ័យ");
      }
      setIsModalOpen(false);
      fetchNotes(currentPage, searchQuery, categoryFilter);
    } catch (err) {
      const apiErrors = err?.response?.data?.errors;
      if (apiErrors) {
        const firstErr = Object.values(apiErrors)[0]?.[0];
        showError(firstErr || "ទិន្នន័យមិនត្រឹមត្រូវឡើយ");
      } else {
        showError(
          err?.response?.data?.message || "បរាជ័យក្នុងការរក្សាទុក Note",
        );
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleTogglePin = async (noteId) => {
    try {
      await api.patch(`/notes/${noteId}/pin`);
      fetchNotes(currentPage, searchQuery, categoryFilter);
    } catch (err) {
      showError("មិនអាចប្តូរ Pin status បានឡើយ");
    }
  };

  const handleDeleteNote = async () => {
    if (!selectedNote) return;
    setActionLoading(true);
    try {
      await api.delete(`/notes/${selectedNote.id}`);
      showSuccess("បានលុប Note ដោយជោគជ័យ", "លុបជោគជ័យ");
      setIsDeleteOpen(false);
      fetchNotes(currentPage, searchQuery, categoryFilter);
    } catch (err) {
      showError(err?.response?.data?.message || "បរាជ័យក្នុងការលុប Note");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3 dark:text-white">
            <FileText className="text-amber-400" size={28} />
            Smart Notes Management
          </h1>
          <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">
            សរុប Notes ទាំងអស់៖{" "}
            <span className="font-bold text-amber-400">{totalNotes}</span>
          </p>
        </div>

        {canCreateNotes && (
          <button
            onClick={() => {
              setSelectedNote(null);
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 rounded-xl shadow-lg shadow-amber-600/30 transition duration-200"
          >
            <Plus size={16} />
            <span>បង្កើត Note ថ្មី</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-100 border border-slate-200 rounded-2xl backdrop-blur-md dark:bg-slate-900/60 dark:border-slate-800">
        <div className="relative flex-1 w-full max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="ស្វែងរក Note តាមចំណងជើង ឬខ្លឹមសារ..."
            className="w-full pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-500 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 transition dark:text-white dark:placeholder-slate-500 dark:bg-slate-950/60 dark:border-slate-800"
          />
        </div>

        <button
          onClick={() => fetchNotes(currentPage, searchQuery, categoryFilter)}
          className="p-2.5 text-slate-600 hover:text-slate-900 bg-slate-200 hover:bg-slate-300 rounded-xl border border-slate-200 transition shrink-0 dark:text-slate-400 dark:hover:text-white dark:bg-slate-800/60 dark:hover:bg-slate-800 dark:border-slate-800"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin text-amber-400" : ""}
          />
        </button>
      </div>

      {/* Notes Grid Cards Layout */}
      {!canViewNotes ? (
        <div className="py-16 text-center bg-slate-100 border border-slate-200 rounded-3xl dark:bg-slate-900/40 dark:border-slate-800">
          <FileText
            size={48}
            className="mx-auto mb-3 text-slate-600 dark:text-slate-400"
          />
          <p className="text-slate-600 text-sm dark:text-slate-400">
            អ្នកមិនមានសិទ្ធិមើល Notes ទេ
          </p>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="p-6 bg-slate-100 border border-slate-200 rounded-3xl animate-pulse h-48 dark:bg-slate-900/60 dark:border-slate-800"
            ></div>
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div className="py-16 text-center bg-slate-100 border border-slate-200 rounded-3xl dark:bg-slate-900/40 dark:border-slate-800">
          <FileText
            size={48}
            className="mx-auto mb-3 text-slate-600 dark:text-slate-400"
          />
          <p className="text-slate-600 text-sm dark:text-slate-400">
            មិនមានទិន្នន័យ Note ឡើយ
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`relative flex flex-col justify-between p-6 bg-white border rounded-3xl shadow-xl transition duration-200 group hover:border-slate-300 dark:bg-slate-900/80 dark:hover:border-slate-700 ${
                note.is_pinned
                  ? "border-amber-500/40 bg-amber-50 dark:bg-slate-900/95"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center gap-1">
                    <Folder size={11} />
                    {note.category || "General"}
                  </span>
                  <button
                    onClick={() => handleTogglePin(note.id)}
                    className={`p-1.5 rounded-lg transition ${
                      note.is_pinned
                        ? "text-amber-400 bg-amber-500/10"
                        : "text-slate-600 hover:text-slate-300"
                    }`}
                    title={note.is_pinned ? "Unpin" : "Pin"}
                  >
                    <Pin
                      size={16}
                      className={note.is_pinned ? "fill-amber-400" : ""}
                    />
                  </button>
                </div>

                {/* Title & Content */}
                <h3 className="text-base font-bold text-slate-900 mb-2 line-clamp-1 dark:text-white">
                  {note.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-4 mb-4 dark:text-slate-400">
                  {note.content || "គ្មានខ្លឹមសារ..."}
                </p>
              </div>

              {/* Card Footer: Tags & Actions */}
              <div>
                {Array.isArray(note.tags) && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md flex items-center gap-1 dark:text-slate-400 dark:bg-slate-950 dark:border-slate-800"
                      >
                        <Tag size={10} className="text-amber-500" />#{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-[11px] text-slate-500 dark:border-slate-800/80 dark:text-slate-500">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>
                      {new Date(note.updated_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                    {canUpdateNotes && (
                      <button
                        onClick={() => {
                          setSelectedNote(note);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 text-slate-600 hover:text-amber-500 hover:bg-slate-100 rounded-lg transition dark:text-slate-400 dark:hover:text-amber-400 dark:hover:bg-slate-800"
                        title="កែប្រែ"
                      >
                        <Edit3 size={15} />
                      </button>
                    )}
                    {canDeleteNotes && (
                      <button
                        onClick={() => {
                          setSelectedNote(note);
                          setIsDeleteOpen(true);
                        }}
                        className="p-1.5 text-slate-600 hover:text-rose-500 hover:bg-slate-100 rounded-lg transition dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-slate-800"
                        title="លុប"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      {lastPage > 1 && (
        <div className="flex items-center justify-between p-4 bg-slate-100 border border-slate-200 rounded-2xl backdrop-blur-md dark:bg-slate-900/60 dark:border-slate-800">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            ទំព័រទី{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {currentPage}
            </span>{" "}
            នៃ{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {lastPage}
            </span>
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 disabled:opacity-40 rounded-xl transition dark:text-slate-400 dark:hover:text-white dark:bg-slate-900 dark:border-slate-800"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              disabled={currentPage === lastPage}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 disabled:opacity-40 rounded-xl transition dark:text-slate-400 dark:hover:text-white dark:bg-slate-900 dark:border-slate-800"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveNote}
        initialData={selectedNote}
        loading={actionLoading}
      />

      <DeleteNoteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteNote}
        noteTitle={selectedNote?.title}
        loading={actionLoading}
      />
    </div>
  );
};

export default NoteList;
