const fetchResultByRestButton = document.getElementById( 'RESTTEST-fetch-return' );
if ( fetchResultByRestButton ){
    fetchResultByRestButton.addEventListener( 'click', function() {
        fetch('http://127.0.0.1:5000/api/Employee', {method: 'GET'}).then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            }).then(
            ( result ) => {
                const textarea = document.getElementById( 'RESTTEST-return' );
                result.forEach(entry => {
                        textarea.value += entry.employeeId + '. ' + entry.firstName + " " + entry.lastName + ',\n';   
                });
            }
        ).catch(error => {
            console.error("Fetch error:", error);
            // alert(`Fetch error: ${error.message}`);
        });
    } );
}

