import customerService from "@/api/customerService";
import readingService from "@/api/readingService";

export default {
    exportCsv,
    exportJson
}

async function exportCsv(objectType, region) {
    try {
        let fileContent;
        let response;
        switch (objectType) {
            case 'customers':
                response = await customerService.exportCustomer('csv');
                fileContent = region == 'eu' ? response.data.replaceAll(',', ';') : response.data;
                break;
            case 'readings':
                response = await readingService.exportReading('csv');
                fileContent = region == 'eu' ? response.data.replaceAll(',', ';') : response.data;
                break;
        }

        downloadFile(fileContent, objectType + '.csv', 'text/csv');
    } catch (error) {
        console.error(`Error while exporting ${objectType} as CSV:`, error);
        alert(`Failed to export ${objectType} as CSV.`);
    }
}

async function exportJson(objectType) {
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
        console.error(`Error while exporting ${objectType} as JSON:`, error);
        alert(`Failed to export ${objectType} as JSON.`);
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