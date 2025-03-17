import customerService from "@/api/customerService";
import readingService from "@/api/readingService";

export default {
    exportJson
}

async function exportJson(objectType) {
    debugger;
    try {
        let fileContent;
        let response;
        switch (objectType) {
            case 'customers':
                response = await customerService.getAllCustomers();
                fileContent = JSON.stringify(response.data);
                break;
            case 'readings':
                response = await readingService.getReadings();
                fileContent = JSON.stringify(response.data);
                break;
        }

        downloadFile(fileContent, objectType + '.json', 'application/json');
    } catch (error) {
        console.error(`Error while exporting ${objectType}:`, error);
        alert(`Failed to export ${objectType}.`);
    }
}

function downloadFile(data, fileName, fileType) {
    const blob = new Blob([data], { type: fileType });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}