document.getElementById("uploadForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById("fileInput");
    const files = fileInput.files;
    const progressBar = document.getElementById("progressBar").querySelector("span");
    const notification = document.getElementById("notification");

    if (files.length === 0) {
        notification.innerText = "Please select files to upload.";
        return;
    }

    const formData = new FormData();
    for (const file of files) {
        formData.append("files", file);
    }

    try {
        notification.innerText = "Uploading...";
        progressBar.style.width = "0%";

        const response = await fetch("/upload", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) throw new Error("Upload failed");

        const result = await response.json();
        progressBar.style.width = "100%";
        notification.innerHTML = `Files compressed successfully! <a href="${result.downloadUrl}" download>Download Compressed Files</a>`;
    } catch (error) {
        notification.innerText = "An error occurred during the upload process.";
    }
});
