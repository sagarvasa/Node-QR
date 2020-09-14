$("#generateQR").click(function () {
    $(this).closest("form").attr("action", "/"); 
})

$("#generateQRURI").click(function(){
    $(this).closest("form").attr("action", "/uri"); 
})

$("#downloadQR").click(function(){
    $(this).closest("form").attr("action", "/save"); 
})

$("#logo").on("change", async function() {
    let file = document.getElementById("logo").files[0];
    let data = await toBase64(file);
    $(".logoImage").val(data)
})


const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});
