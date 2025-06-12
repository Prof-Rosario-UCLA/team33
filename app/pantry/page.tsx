"use client";
import { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaEdit, FaCamera } from "react-icons/fa";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ExtendedSession } from "../types/auth";

type PantryItem = {
  id: string;
  name: string;
  qty: number;
  expirationDate?: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export default function PantryPage() {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newItem, setNewItem] = useState({ name: "", qty: 1, expirationDate: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState({ name: "", qty: 1, expirationDate: "" });
  const { data: session } = useSession() as { data: ExtendedSession | null };

  // Fetch pantry items
  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) return;
    
    setLoading(true);
    fetch(`/api/pantry-items?userId=${userId}`)
      .then((res) => res.json())
      .then((data: PantryItem[]) => setItems(data))
      .catch(() => setError("Failed to load items"))
      .finally(() => setLoading(false));
  }, [session]);

  // Add item
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = session?.user?.id;
    if (!userId) {
      setError("Authentication required. Please sign in.");
      return;
    }
    
    setLoading(true);
    setError("");
    const res = await fetch("/api/pantry-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newItem, userId }),
    });
    if (!res.ok) return setError("Failed to add item");
    const item: PantryItem = await res.json();
    setItems([item, ...items]);
    setNewItem({ name: "", qty: 1, expirationDate: "" });
    setLoading(false);
  };

  // Delete item
  const handleDelete = async (id: string) => {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/pantry-items?id=${id}`, { method: "DELETE" });
    if (!res.ok) return setError("Failed to delete item");
    setItems(items.filter((i) => i.id !== id));
    setLoading(false);
  };

  // Start editing
  const startEdit = (item: PantryItem) => {
    setEditingId(item.id);
    setEditItem({ name: item.name, qty: item.qty, expirationDate: item.expirationDate?.slice(0, 10) || "" });
  };

  // Save edit
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/pantry-items", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingId, ...editItem }),
    });
    if (!res.ok) return setError("Failed to update item");
    const updated: PantryItem = await res.json();
    setItems(items.map((i) => (i.id === editingId ? updated : i)));
    setEditingId(null);
    setEditItem({ name: "", qty: 1, expirationDate: "" });
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">In Your Pantry</h1>
          <p className="text-gray-600 mt-1">Add items to get personalized recipe suggestions</p>
        </div>
        <div className="flex gap-2">
          <Link 
            href="/scan"
            className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-primary transition-colors flex items-center gap-2"
          >
            <FaCamera /> AI Scan
          </Link>
        </div>
        <form className="flex gap-2" onSubmit={editingId ? handleEdit : handleAdd}>
          <input
            type="text"
            placeholder="Item name"
            className="rounded-lg px-4 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary bg-background"
            value={editingId ? editItem.name : newItem.name}
            onChange={(e) =>
              editingId
                ? setEditItem({ ...editItem, name: e.target.value })
                : setNewItem({ ...newItem, name: e.target.value })
            }
            required
          />
          <input
            type="number"
            min="1"
            className="w-20 rounded-lg px-2 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary bg-background"
            value={editingId ? editItem.qty : newItem.qty}
            onChange={(e) =>
              editingId
                ? setEditItem({ ...editItem, qty: +e.target.value })
                : setNewItem({ ...newItem, qty: +e.target.value })
            }
            required
          />
          <input
            type="date"
            className="rounded-lg px-2 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary bg-background"
            value={editingId ? editItem.expirationDate : newItem.expirationDate}
            onChange={(e) =>
              editingId
                ? setEditItem({ ...editItem, expirationDate: e.target.value })
                : setNewItem({ ...newItem, expirationDate: e.target.value })
            }
          />
          <button
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors flex items-center gap-2"
            type="submit"
          >
            <FaPlus /> {editingId ? "Save" : "Add"}
          </button>
          {editingId && (
            <button
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg ml-2"
              type="button"
              onClick={() => {
                setEditingId(null);
                setEditItem({ name: "", qty: 1, expirationDate: "" });
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>
      {error && <div className="text-alert mb-4">{error}</div>}
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center bg-white rounded-xl shadow p-4 border border-gray-100"
            >
              <span className="font-semibold text-gray-800 text-lg mb-1">{item.name}</span>
              <span className="text-gray-600 text-sm mb-1">Qty: {item.qty}</span>
              {item.expirationDate && (
                <span className="text-xs text-secondary mb-2">Expires: {item.expirationDate.slice(0, 10)}</span>
              )}
              <div className="flex gap-2 mt-2">
                <button className="text-primary hover:text-secondary" onClick={() => startEdit(item)}>
                  <FaEdit />
                </button>
                <button className="text-alert hover:text-secondary" onClick={() => handleDelete(item.id)}>
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length > 0 && (
        <div className="text-center mt-8">
          <Link
            href="/recipes"
            className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-primary transition-colors inline-flex items-center gap-2 font-medium"
          >
            Find Recipes with Your Ingredients
          </Link>
        </div>
      )}
    </div>
  );
}
