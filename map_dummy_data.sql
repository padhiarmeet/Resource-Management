-- Dummy Data for Campus Map Buildings and Resources

-- 1. First, ensure you have the correct buildings matching the Map Page
-- Uncomment and run this if you need to set up the buildings:
/*
INSERT INTO buildings (building_id, building_name, building_number, total_floors) VALUES 
(1, 'A-Block (Top)', 'A', 2),
(2, 'C-Block (West)', 'C-W', 2),
(3, 'C-Block (East)', 'C-E', 2),
(4, 'D-Block (South)', 'D-S', 2),
(5, 'D-Block (West)', 'D-W', 2),
(6, 'C-Block (South-East)', 'C-SE', 2);
*/

-- 2. Ensure your resource types mapping is correct:
-- 1: Classroom
-- 2: Computer Lab/Lab
-- 3: Auditorium/Hall
-- 4: Meeting Room

-- 3. Insert Resources
-- resource_id | resource_name | resource_type_id | building_id | floor_number | description
INSERT INTO resources (resource_id, resource_name, resource_type_id, building_id, floor_number, description) VALUES
-- A-Block (Top) - Building ID 1
(1, 'Classroom A-101', 1, 1, 1, 'Standard Classroom with capacity 60'),
(2, 'Classroom A-102', 1, 1, 1, 'Standard Classroom with capacity 50'),
(3, 'Computer Lab A-103', 2, 1, 1, 'Advanced Computer Lab'),
(4, 'Meeting Room A-201', 4, 1, 2, 'Main A-Block Meeting Room'),
(5, 'Auditorium A-Main', 3, 1, 0, 'A-Block Ground Auditorium'),

-- C-Block (West) - Building ID 2
(6, 'Classroom C-W-101', 1, 2, 1, 'Classroom in West C-Block'),
(7, 'Classroom C-W-102', 1, 2, 1, 'Classroom in West C-Block'),
(8, 'Programming Lab C-W-201', 2, 2, 2, 'Computer lab for competitive programming'),
(9, 'Meeting Room C-W-301', 4, 2, 3, 'Faculty Meeting Room'),

-- C-Block (East) - Building ID 3
(10, 'Classroom C-E-101', 1, 3, 1, 'Classroom in East C-Block'),
(11, 'Classroom C-E-102', 1, 3, 1, 'Classroom in East C-Block'),
(12, 'Hardware Lab C-E-201', 2, 3, 2, 'Hardware & Networking Lab'),
(13, 'Hardware Lab C-E-202', 2, 3, 2, 'Electronics Lab'),

-- D-Block (South) - Building ID 4
(14, 'Classroom D-S-101', 1, 4, 1, 'Classroom in South D-Block'),
(15, 'Classroom D-S-102', 1, 4, 1, 'Classroom in South D-Block'),
(16, 'Meeting Room D-S-201', 4, 4, 2, 'Conference Room for D-Block Staff'),
(17, 'Auditorium D-S-301', 3, 4, 3, 'South D-Block Mini Auditorium'),

-- D-Block (West) - Building ID 5
(18, 'Classroom D-W-101', 1, 5, 1, 'Classroom in West D-Block'),
(19, 'Classroom D-W-102', 1, 5, 1, 'Classroom in West D-Block'),
(20, 'Research Lab D-W-201', 2, 5, 2, 'AI/ML Research Lab'),
(21, 'Data Science Lab D-W-202', 2, 5, 2, 'Data Science & Analytics Lab'),

-- C-Block (South-East) - Building ID 6
(22, 'Classroom C-SE-101', 1, 6, 1, 'Classroom in South-East C-Block'),
(23, 'Classroom C-SE-102', 1, 6, 1, 'Classroom in South-East C-Block'),
(24, 'Classroom C-SE-201', 1, 6, 2, 'Smart Classroom with Projector'),
(25, 'Auditorium C-SE', 3, 6, 0, 'Main Event Auditorium for South-East Block');
