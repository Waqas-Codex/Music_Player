// 'use client';

// import { useState, useMemo } from 'react';
// import Image from 'next/image';
// import { Search, Plus, Music2, CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';
// import { Song } from '@/services/song.service';
// import { getMediaUrl } from '@/lib/mediaUrl';

// interface AddSongToPlaylistProps {
//   availableSongs: Song[];
//   selectedSongId: string;
//   addingSong: boolean;
//   message: string | null;
//   onChange: (songId: string) => void;
//   onAdd: () => void;
// }

// function formatDuration(seconds?: number): string {
//   if (!seconds || isNaN(seconds)) return '';
//   const m = Math.floor(seconds / 60);
//   const s = Math.floor(seconds % 60);
//   return `${m}:${s.toString().padStart(2, '0')}`;
// }

// export function AddSongToPlaylist({
//   availableSongs,
//   selectedSongId,
//   addingSong,
//   message,
//   onChange,
//   onAdd,
// }: AddSongToPlaylistProps) {
//   const [query, setQuery] = useState('');

//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     if (!q) return availableSongs;
//     return availableSongs.filter(
//       (s) =>
//         s.title?.toLowerCase().includes(q) ||
//         s.artist?.toLowerCase().includes(q) ||
//         s.album?.toLowerCase().includes(q),
//     );
//   }, [availableSongs, query]);

//   const selectedSong = availableSongs.find((s) => s._id === selectedSongId) ?? null;
//   const isSuccess = message && !message.toLowerCase().includes('error') && !message.toLowerCase().includes('fail');

//   return (
//     <div className="rounded-2xl border border-slate-800/60 bg-slate-950 overflow-hidden">

//       {/* ── Header ── */}
//       <div className="flex items-start justify-between gap-4 border-b border-slate-800/60 px-5 py-4 sm:px-6">
//         <div>
//           <h3 className="text-base font-bold text-white tracking-tight">Add to playlist</h3>
//           <p className="mt-0.5 text-xs text-slate-500">
//             {availableSongs.length === 0
//               ? 'All library songs are already in this playlist'
//               : `${availableSongs.length} song${availableSongs.length === 1 ? '' : 's'} available`}
//           </p>
//         </div>

//         {/* Add button — top-right shortcut */}
//         <button
//           type="button"
//           onClick={onAdd}
//           disabled={addingSong || !selectedSongId}
//           className="inline-flex shrink-0 items-center gap-2 rounded-full bg-green-400 px-5 py-2 text-xs font-bold text-black transition-all duration-150 hover:bg-green-300 hover:scale-[1.02] active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
//           style={{ boxShadow: selectedSongId ? '0 4px 20px rgba(74,222,128,0.22)' : 'none' }}
//         >
//           {addingSong ? (
//             <Loader2 size={14} className="animate-spin" />
//           ) : (
//             <Plus size={14} />
//           )}
//           {addingSong ? 'Adding…' : 'Add song'}
//         </button>
//       </div>

//       {/* ── Selected song preview ── */}
//       {selectedSong && (
//         <div className="flex items-center gap-3 border-b border-slate-800/60 bg-green-950/20 px-5 py-3 sm:px-6">
//           <CheckCircle2 size={14} className="shrink-0 text-green-400" />
//           <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md bg-slate-800">
//             {getMediaUrl(selectedSong.coverImage) ? (
//               <Image
//                 src={getMediaUrl(selectedSong.coverImage)}
//                 alt={selectedSong.title}
//                 fill
//                 className="object-cover"
//                 sizes="32px"
//                 unoptimized
//               />
//             ) : (
//               <div className="flex h-full w-full items-center justify-center">
//                 <Music2 size={12} className="text-slate-600" />
//               </div>
//             )}
//           </div>
//           <div className="min-w-0 flex-1">
//             <p className="truncate text-xs font-semibold text-green-400">{selectedSong.title}</p>
//             <p className="truncate text-[11px] text-slate-500">{selectedSong.artist}</p>
//           </div>
//           <button
//             type="button"
//             onClick={() => onChange('')}
//             className="shrink-0 text-slate-600 hover:text-slate-400 transition-colors"
//             aria-label="Clear selection"
//           >
//             <X size={14} />
//           </button>
//         </div>
//       )}

//       {/* ── Search ── */}
//       {availableSongs.length > 0 && (
//         <div className="border-b border-slate-800/60 px-5 py-3 sm:px-6">
//           <div className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 focus-within:border-slate-600 transition-colors">
//             <Search size={14} className="shrink-0 text-slate-600" />
//             <input
//               type="text"
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               placeholder="Search by title, artist, or album…"
//               className="flex-1 bg-transparent text-xs text-white placeholder:text-slate-600 outline-none"
//             />
//             {query && (
//               <button
//                 type="button"
//                 onClick={() => setQuery('')}
//                 className="text-slate-600 hover:text-slate-400 transition-colors"
//                 aria-label="Clear search"
//               >
//                 <X size={13} />
//               </button>
//             )}
//           </div>
//         </div>
//       )}

//       {/* ── Song list ── */}
//       <div className="max-h-72 overflow-y-auto overscroll-contain scrollbar-thin">
//         {availableSongs.length === 0 ? (
//           /* Empty state: nothing in library to add */
//           <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
//             <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-800 bg-slate-900">
//               <Music2 size={20} className="text-slate-600" />
//             </div>
//             <div>
//               <p className="text-sm font-semibold text-slate-400">Nothing left to add</p>
//               <p className="mt-1 text-xs text-slate-600">All your library songs are already in this playlist.</p>
//             </div>
//           </div>
//         ) : filtered.length === 0 ? (
//           /* Empty state: search returned nothing */
//           <div className="flex flex-col items-center justify-center gap-2 px-6 py-10 text-center">
//             <Search size={18} className="text-slate-700" />
//             <p className="text-sm text-slate-500">No songs match <span className="text-slate-300">"{query}"</span></p>
//             <button
//               type="button"
//               onClick={() => setQuery('')}
//               className="mt-1 text-xs text-green-500 hover:text-green-400 underline underline-offset-2 transition-colors"
//             >
//               Clear search
//             </button>
//           </div>
//         ) : (
//           <div className="divide-y divide-slate-800/40">
//             {filtered.map((song) => {
//               const isSelected = song._id === selectedSongId;
//               const coverUrl = getMediaUrl(song.coverImage);
//               const duration = formatDuration(song.duration);

//               return (
//                 <button
//                   key={song._id}
//                   type="button"
//                   onClick={() => onChange(isSelected ? '' : song._id)}
//                   className={`group w-full flex items-center gap-3 px-5 py-3 text-left transition-colors duration-100 sm:px-6 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-500 ${
//                     isSelected
//                       ? 'bg-green-950/30'
//                       : 'hover:bg-slate-900/70'
//                   }`}
//                 >
//                   {/* Cover */}
//                   <div className={`relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border transition-colors ${isSelected ? 'border-green-500/50' : 'border-transparent'} bg-slate-800`}>
//                     {coverUrl ? (
//                       <Image
//                         src={coverUrl}
//                         alt={song.title}
//                         fill
//                         className="object-cover"
//                         sizes="40px"
//                         unoptimized
//                       />
//                     ) : (
//                       <div className="flex h-full w-full items-center justify-center">
//                         <Music2 size={14} className="text-slate-600" />
//                       </div>
//                     )}
//                     {/* Selected check overlay */}
//                     {isSelected && (
//                       <div className="absolute inset-0 flex items-center justify-center bg-green-950/60 rounded-lg">
//                         <CheckCircle2 size={16} className="text-green-400" />
//                       </div>
//                     )}
//                   </div>

//                   {/* Text */}
//                   <div className="min-w-0 flex-1">
//                     <p className={`truncate text-sm font-semibold leading-tight ${isSelected ? 'text-green-400' : 'text-white'}`}>
//                       {song.title}
//                     </p>
//                     <p className="mt-0.5 truncate text-xs text-slate-500">
//                       {song.artist}
//                       {song.album && (
//                         <span className="text-slate-700"> · {song.album}</span>
//                       )}
//                     </p>
//                   </div>

//                   {/* Duration */}
//                   {duration && (
//                     <span className="shrink-0 text-[11px] tabular-nums text-slate-600">
//                       {duration}
//                     </span>
//                   )}
//                 </button>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {/* ── Status message ── */}
//       {message && (
//         <div className={`flex items-center gap-2.5 border-t px-5 py-3 sm:px-6 ${
//           isSuccess
//             ? 'border-green-900/40 bg-green-950/20'
//             : 'border-red-900/40 bg-red-950/20'
//         }`}>
//           {isSuccess
//             ? <CheckCircle2 size={14} className="shrink-0 text-green-400" />
//             : <AlertCircle size={14} className="shrink-0 text-red-400" />
//           }
//           <p className={`text-xs font-medium ${isSuccess ? 'text-green-400' : 'text-red-400'}`}>
//             {message}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }