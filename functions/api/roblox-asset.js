export async function onRequest(context) {
    const { searchParams } = new URL(context.request.url);
    const id = searchParams.get("id");

    if (!id || !/^\d+$/.test(id)) {
        return new Response("Invalid ID", { status: 400 });
    }

    const upstream = await fetch(
        `https://assetdelivery.roblox.com/v1/asset/?id=${id}`,
        {
            headers: {
                "User-Agent": "Roblox/WinInet",
            },
        }
    );

    if (!upstream.ok) {
        return new Response("Asset not found", { status: 404 });
    }

    const contentType = upstream.headers.get("content-type") || "image/png";
    const body = await upstream.arrayBuffer();

    return new Response(body, {
        status: 200,
        headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=31536000, immutable",
            "Access-Control-Allow-Origin": "*",
        },
    });
}
