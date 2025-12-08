export function getUsuarioDoToken() {
    const token = localStorage.getItem("@Barbearia:token");
    if (!token) return null;

    try {
        // Decodifica a parte do payload do JWT (base64)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const decoded = JSON.parse(jsonPayload);
        
        // Retorna o ID e o Email (Subject)
        // ATENÇÃO: Verifique se no seu TokenService java você colocou o ID numa claim chamada "id"
        // Se não colocou, precisaremos buscar o usuário pelo email (/me) primeiro.
        // Vou assumir que você adicionou .withClaim("id", usuario.getId()) no Java.
        return {
            id: decoded.id, 
            email: decoded.sub,
            role: decoded.role
        };
    } catch (error) {
        console.error("Erro ao decodificar token", error);
        return null;
    }
}