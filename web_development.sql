CREATE TABLE `appointments` (
  `id_appointment` int(11) NOT NULL,
  `id_patient` int(11) DEFAULT NULL,
  `id_doctor` int(11) DEFAULT NULL,
  `patient_name` text NOT NULL,
  `patient_email` varchar(255) NOT NULL,
  `patient_phone` varchar(20) NOT NULL,
  `day_to_meet` date DEFAULT NULL,
  `time_to_meet` time DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('pending','accepted','declined') NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id_appointment`, `id_patient`, `id_doctor`, `patient_name`, `patient_email`, `patient_phone`, `day_to_meet`, `time_to_meet`, `created_at`, `status`) VALUES
(5, 2, 4, 'ICU', 'hmq191@gmail.com', '0902544245', '2024-07-08', '19:20:00', '2024-07-12 08:20:21', 'accepted'),
(6, 2, 15, 'tenkhongdau', 'hmq191@gmail.com', '0902544245', '2024-07-07', '15:47:00', '2024-07-12 08:42:47', 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `author_id` int(11) NOT NULL,
  `parent_comment_id` int(11) DEFAULT NULL,
  `role` enum('admin','doctor','patient') NOT NULL DEFAULT 'patient',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `post_id`, `content`, `author_id`, `parent_comment_id`, `role`, `created_at`) VALUES
(21, 26, 'watch me', 4, NULL, 'patient', '2024-07-10 13:57:56'),
(23, 27, 'new song', 4, NULL, 'patient', '2024-07-10 14:14:01'),
(25, 26, 'toi la admin', 5, NULL, 'patient', '2024-07-10 14:18:04'),
(26, 26, 'reply cai nay', 4, NULL, 'patient', '2024-07-10 14:48:08'),
(27, 26, 'rep nè', 5, NULL, 'patient', '2024-07-10 17:29:15'),
(28, 26, 'speak dial number 1', 5, NULL, 'patient', '2024-07-10 17:33:23'),
(29, 37, 'comment ne', 5, NULL, 'patient', '2024-07-10 17:38:36'),
(30, 27, 'hi', 5, NULL, 'patient', '2024-07-10 17:39:19'),
(31, 40, 'reply luon', 4, NULL, 'patient', '2024-07-10 18:09:54'),
(32, 40, 'khong sao ma', 4, NULL, 'patient', '2024-07-10 18:10:48'),
(33, 26, 'something', 4, NULL, 'patient', '2024-07-10 18:36:54'),
(34, 26, 'ngời ánh sao', 4, NULL, 'patient', '2024-07-10 19:06:25'),
(35, 28, 'tháng 10 hàng cây trước lá', 4, NULL, 'patient', '2024-07-10 19:06:38'),
(36, 41, 'last drop', 4, NULL, 'patient', '2024-07-10 19:11:04'),
(37, 41, 'https://www.youtube.com/watch?v=FyG21rXCxlY', 4, NULL, 'patient', '2024-07-10 19:11:42'),
(38, 26, 'rep nè', 4, NULL, 'patient', '2024-07-10 19:24:58'),
(39, 42, 'it\'s okay', 4, NULL, 'patient', '2024-07-12 07:31:28'),
(40, 26, 'feel the thunder', 4, NULL, 'patient', '2024-07-12 07:31:41'),
(41, 26, 'massive', 4, NULL, 'patient', '2024-07-12 07:31:56'),
(42, 26, 'rock', 4, NULL, 'patient', '2024-07-12 07:31:59');

-- --------------------------------------------------------

--
-- Table structure for table `doctors`
--

CREATE TABLE `doctors` (
  `id_doctor` int(11) NOT NULL,
  `doctor_name` varchar(100) NOT NULL,
  `specialization` enum('Neurology','Cardiology','Pathology','Laboratory','Pediatric','Cardiac') NOT NULL,
  `description` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `userId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `doctors`
--

INSERT INTO `doctors` (`id_doctor`, `doctor_name`, `specialization`, `description`, `created_at`, `userId`) VALUES
(4, 'IRENE', 'Cardiac', 'I\'m experienced with 13 years of working in this field', '2024-07-12 08:14:53', NULL),
(12, 'irene', 'Pathology', 'aint no rest', '2024-07-12 08:17:55', NULL),
(15, 'IRENE TEST DOCTOR ID', 'Neurology', 'test doctor ID', '2024-07-12 08:42:02', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
  `id_patient` int(11) NOT NULL,
  `patient_name` varchar(100) NOT NULL,
  `patient_age` int(11) NOT NULL,
  `patient_description` text DEFAULT NULL,
  `specialization_needed` enum('Neurology','Cardiology','Pathology','Laboratory','Pediatric','Cardiac') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`id_patient`, `patient_name`, `patient_age`, `patient_description`, `specialization_needed`, `created_at`) VALUES
(1, 'tenkhongdau', 12, '33', 'Neurology', '2024-07-02 02:52:11'),
(2, 'huynhminhquan', 25, 'hello', 'Neurology', '2024-07-02 02:54:56'),
(3, 'hmq', 234, 'chay bo chong mat qua', 'Neurology', '2024-07-02 02:56:06'),
(4, '2', 2, '3', 'Neurology', '2024-07-02 04:22:18'),
(5, 'ww', 23, 'io', 'Neurology', '2024-07-02 04:23:47'),
(6, 'tenkhongdau', 23, 'hello', 'Neurology', '2024-07-02 04:27:51'),
(7, 'huynhminhquan', 789, '65', 'Neurology', '2024-07-02 04:32:25'),
(8, 'g', 33, 'kk', 'Neurology', '2024-07-02 04:41:24'),
(9, 'tenkhongdau', 4, '333', 'Neurology', '2024-07-02 04:42:11'),
(10, 'tenkhongdau', 22, '33', 'Neurology', '2024-07-02 04:42:38'),
(11, 'kk', 23, 'kkk', 'Neurology', '2024-07-02 04:49:24'),
(12, 'tenkhongdau', 3, 'kki', 'Neurology', '2024-07-02 04:50:06'),
(13, 'tenkhongdau', 3, 'kki', 'Neurology', '2024-07-02 04:51:32'),
(14, 'tenkhongdau', 44, '12', 'Neurology', '2024-07-02 04:58:04'),
(15, 'yeri', 25, 'rv', 'Neurology', '2024-07-02 13:12:22'),
(16, 'joy', 33, 'rvvv', 'Neurology', '2024-07-02 13:17:28'),
(17, 'Quan here', 23, 'hhh', 'Neurology', '2024-07-12 05:26:14');

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `content` text NOT NULL,
  `author_id` int(11) NOT NULL,
  `role` enum('admin','doctor','patient') NOT NULL DEFAULT 'patient',
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `content`, `author_id`, `role`, `created_at`) VALUES
(26, 'accendio', 4, 'patient', '2024-07-10 13:57:41'),
(27, 'adding', 4, 'patient', '2024-07-10 14:13:30'),
(28, 'raise', 4, 'patient', '2024-07-10 14:36:53'),
(29, 'dont hurt me', 5, 'patient', '2024-07-10 17:29:03'),
(37, 'e', 5, 'patient', '2024-07-10 17:37:48'),
(38, 'e', 5, 'patient', '2024-07-10 17:38:09'),
(39, 'dang bai ne', 5, 'patient', '2024-07-10 17:39:31'),
(40, 'stream', 4, 'patient', '2024-07-10 18:09:44'),
(41, 'imagine', 4, 'patient', '2024-07-10 18:10:07'),
(42, 'i dont know', 4, 'patient', '2024-07-10 18:37:13');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','doctor','patient') NOT NULL DEFAULT 'patient'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`) VALUES
(1, 'HMQ', 'hmq@admin.com', '$2a$08$JrLXlbaGb8tNuNIvtm9qz.XWjc9Sn1z6hemVvI1rbJW9mjU7oyp..', 'admin'),
(2, 'HMQ', 'fuko@gmail.com', '$2a$08$85yWCv2r3yl/gC2iN8aojuqRvAUSXidjGS2lEBnwneBBNWXMmKtf2', 'patient'),
(3, 'wendy', 'wendy@doctor.com', '$2a$08$jNUQmvKD1dqjoqZRzyd/QO2PfTarhtrBHg4en23CVYNL5qznPXEfS', 'doctor'),
(4, 'irene', 'irene@doctor.com', '$2a$08$f12oRatdMY2oOmrqwIoIN.nyVih2OX3qXZGWkQG0nsY9wZjU.4LHW', 'doctor'),
(5, 'hmq admin', 'hmq.medimate@gmail.com', '$2a$08$Lh9GtWgq3qWXS9kjaw1sVefz6JdBxpAVojqLN7vZ9KrbwYdhF8LIa', 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for dumped tables
--
CREATE TABLE `symptoms` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(100) NOT NULL,
    `description` text,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table `symptoms`
INSERT INTO `symptoms` (`name`, `description`) VALUES
('Fever', 'An abnormally high body temperature, usually accompanied by shivering, headache, and in severe instances, delirium.'),
('Cough', 'A sudden, forceful hacking sound to release air and clear an irritation in the throat or airway.'),
('Headache', 'Pain in any region of the head.'),
('Sore Throat', 'Pain or irritation in the throat that can occur with or without swallowing, often accompanies infections such as colds or flu.'),
('Fatigue', 'Extreme tiredness resulting from mental or physical exertion or illness.');

-- --------------------------------------------------------

-- Table structure for table `diseases`
CREATE TABLE `diseases` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(100) NOT NULL,
    `description` text,
    `treatment` text,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table `diseases`
INSERT INTO `diseases` (`name`, `description`, `treatment`) VALUES
('Common Cold', 'A viral infection of your nose and throat (upper respiratory tract).', 'Rest, fluids, and over-the-counter cold remedies.'),
('Influenza', 'A viral infection that attacks your respiratory system — your nose, throat, and lungs.', 'Antiviral drugs, rest, and fluids.'),
('Strep Throat', 'A bacterial infection that can make your throat feel sore and scratchy.', 'Antibiotics and rest.'),
('Migraine', 'A headache of varying intensity, often accompanied by nausea and sensitivity to light and sound.', 'Medications for pain relief and prevention, lifestyle changes.');

-- --------------------------------------------------------

-- Table structure for table `disease_symptoms`
CREATE TABLE `disease_symptoms` (
    `disease_id` int(11) NOT NULL,
    `symptom_id` int(11) NOT NULL,
    PRIMARY KEY (`disease_id`, `symptom_id`),
    FOREIGN KEY (`disease_id`) REFERENCES `diseases` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`symptom_id`) REFERENCES `symptoms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table `disease_symptoms`
INSERT INTO `disease_symptoms` (`disease_id`, `symptom_id`) VALUES
(1, 1), -- Common Cold - Fever
(1, 2), -- Common Cold - Cough
(1, 4), -- Common Cold - Sore Throat
(1, 5), -- Common Cold - Fatigue
(2, 1), -- Influenza - Fever
(2, 2), -- Influenza - Cough
(2, 5), -- Influenza - Fatigue
(3, 4), -- Strep Throat - Sore Throat
(3, 1), -- Strep Throat - Fever
(4, 3), -- Migraine - Headache
(4, 5); -- Migraine - Fatigue

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id_appointment`),
  ADD KEY `id_patient` (`id_patient`),
  ADD KEY `id_doctor` (`id_doctor`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `post_id` (`post_id`),
  ADD KEY `comments_ibfk_2` (`author_id`),
  ADD KEY `parent_comment_id` (`parent_comment_id`);

--
-- Indexes for table `doctors`
--
ALTER TABLE `doctors`
  ADD PRIMARY KEY (`id_doctor`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`id_patient`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `author_id` (`author_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id_appointment` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `doctors`
--
ALTER TABLE `doctors`
  MODIFY `id_doctor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `patients`
--
ALTER TABLE `patients`
  MODIFY `id_patient` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`id_patient`) REFERENCES `patients` (`id_patient`) ON DELETE CASCADE ON UPDATE CASCADE;


--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`),
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`parent_comment_id`) REFERENCES `comments` (`id`);

--
-- Constraints for table `doctors`
--
--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`);
COMMIT;
