export const icon=(name,size=20)=>{const paths={
 copy:'<rect x="8" y="8" width="12" height="12" rx="1"/><path d="M16 8V4H4v12h4"/>',
 lock:'<rect x="5" y="10" width="14" height="11" rx="1"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
 receive:'<path d="M12 3v15m-6-6 6 6 6-6M4 21h16"/>',
 send:'<path d="M12 20V5m-6 6 6-6 6 6"/>',
 swap:'<path d="M4 8h16m-4-4 4 4-4 4M20 16H4m4-4-4 4 4 4"/>',
 wallet:'<rect x="3" y="5" width="18" height="15" rx="1"/><path d="M3 8h18m-5 6h5"/>',
 history:'<path d="M4 7a9 9 0 1 1-1 7M3 3v5h5m4-1v6l4 2"/>',
 settings:'<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3" fill="var(--bg)"/><circle cx="15" cy="17" r="3" fill="var(--bg)"/>',
 refresh:'<path d="M4 8a8 8 0 1 1-1 7M3 3v6h6"/>',
 back:'<path d="m14 5-7 7 7 7M7 12h13"/>',
 check:'<path d="m5 12 4 4L19 6"/>',
 arrow:'<path d="M5 19 19 5M7 5h12v12"/>'};
return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.wallet}</svg>`;};
