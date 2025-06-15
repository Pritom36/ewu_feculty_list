// Make closePopup function global and accessible from HTML
function closePopup() {
    const popup = document.getElementById('popupOverlay');
    if (popup) {
        popup.style.display = 'none';
    }
}

// Wait for the HTML document to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    
    // Get references to HTML elements
    const courseTableBody = document.getElementById('course-table-body');
    const courseSearchInput = document.getElementById('courseSearch');
    const facultySearchInput = document.getElementById('facultySearch');
    const sectionSearchInput = document.getElementById('sectionSearch');
    const noResultsDiv = document.getElementById('no-results');
    
    let allCourses = []; // This will store the full list of courses from the JSON file

    // --- 1. Fetch Course Data ---
    // This function fetches the course data from our future 'courses.json' file
    const fetchCourses = async () => {
        try {
            const response = await fetch('courses.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            allCourses = data; // Store the fetched data in our global variable
            displayCourses(allCourses); // Display all courses initially
        } catch (error) {
            console.error('Error fetching course data:', error);
            courseTableBody.innerHTML = '<tr><td colspan="5">Failed to load course data. Please try again later.</td></tr>';
        }
    };

    // --- 2. Display Courses in the Table ---
    // This function takes an array of course objects and populates the table
    const displayCourses = (courses) => {
        courseTableBody.innerHTML = ''; // Clear the table body first

        if (courses.length === 0) {
            noResultsDiv.classList.remove('hidden'); // Show the "No results" message
        } else {
            noResultsDiv.classList.add('hidden'); // Hide the "No results" message
            courses.forEach(course => {
                const row = document.createElement('tr');
                
                // Using innerHTML to create the cells for each row
                row.innerHTML = `
                    <td>${course.course}</td>
                    <td>${course.faculty}</td>
                    <td>${course.section}</td>
                    <td>${course.seat}</td>
                    <td>${course.timeslot}</td>
                `;
                
                courseTableBody.appendChild(row);
            });
        }
    };

    // --- 3. Filter and Search Logic ---
    // This function filters the courses based on the user's input
    const filterCourses = () => {
        // Get the current values from the search inputs, and convert to lower case for case-insensitive search
        const courseQuery = courseSearchInput.value.toLowerCase();
        const facultyQuery = facultySearchInput.value.toLowerCase();
        const sectionQuery = sectionSearchInput.value.toLowerCase();

        // The filter method creates a new array with all elements that pass the test
        const filteredCourses = allCourses.filter(course => {
            // Check if each course matches all active search queries
            const courseMatch = course.course.toLowerCase().includes(courseQuery);
            const facultyMatch = course.faculty.toLowerCase().includes(facultyQuery);
            const sectionMatch = course.section.toString().toLowerCase().includes(sectionQuery);
            
            // A course is included only if it matches all three filter criteria
            return courseMatch && facultyMatch && sectionMatch;
        });

        // Display the newly filtered list of courses
        displayCourses(filteredCourses);
    };

    // --- 4. Event Listeners ---
    // Add event listeners to the input fields to trigger the filter function on every key press
    courseSearchInput.addEventListener('input', filterCourses);
    facultySearchInput.addEventListener('input', filterCourses);
    sectionSearchInput.addEventListener('input', filterCourses);

    // --- Popup Functionality ---
    // Close popup when clicking outside the content
    const popup = document.getElementById('popupOverlay');
    if (popup) {
        popup.addEventListener('click', function(e) {
            if (e.target === popup) {
                closePopup();
            }
        });
    }

    // --- Initial Load ---
    // Fetch the courses when the page loads
    fetchCourses();
});