export interface DeviceInfo {
    name: string;
    type: 'Desktop' | 'Mobile' | 'Tablet';
}

export const getDeviceInfo = (): DeviceInfo => {
    const ua = navigator.userAgent;
    let os = "Unknown OS";
    let browser = "Unknown Browser";
    let type: 'Desktop' | 'Mobile' | 'Tablet' = 'Desktop';

    if (ua.indexOf("Win") !== -1) os = "Windows";
    else if (ua.indexOf("Mac") !== -1) os = "MacOS";
    else if (ua.indexOf("Linux") !== -1) os = "Linux";
    else if (ua.indexOf("Android") !== -1) { os = "Android"; type = "Mobile"; }
    else if (ua.indexOf("like Mac") !== -1) { os = "iOS"; type = "Mobile"; }

    if (ua.indexOf("Chrome") !== -1 && ua.indexOf("Edg") === -1) browser = "Chrome";
    else if (ua.indexOf("Firefox") !== -1) browser = "Firefox";
    else if (ua.indexOf("Safari") !== -1 && ua.indexOf("Chrome") === -1) browser = "Safari";
    else if (ua.indexOf("Edg") !== -1) browser = "Edge";

    return {
        name: `${os} (${browser})`,
        type: type
    };
};