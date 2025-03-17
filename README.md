## File Tree
```
📦frontend
 ┣ 📂.github
 ┃ ┗ 📂workflows
 ┃ ┃ ┗ 📜ci-cd.yaml
 ┣ 📂helm
 ┃ ┣ 📂apps
 ┃ ┃ ┣ 📂templates
 ┃ ┃ ┃ ┗ 📜frontend-application.yaml
 ┃ ┃ ┣ 📜Chart.yaml
 ┃ ┃ ┗ 📜values.yaml
 ┃ ┗ 📂frontend
 ┃ ┃ ┣ 📂templates
 ┃ ┃ ┃ ┣ 📜deployment.yaml
 ┃ ┃ ┃ ┗ 📜service.yaml
 ┃ ┃ ┣ 📜.helmignore
 ┃ ┃ ┣ 📜Chart.yaml
 ┃ ┃ ┗ 📜values.yaml
 ┣ 📂node_modules
 ┣ 📂public
 ┣ 📂src
 ┃ ┣ 📂components
 ┃ ┃ ┣ 📜DiaryModal.jsx
 ┃ ┃ ┣ 📜Navigator.jsx
 ┃ ┃ ┗ 📜UserEditModal.jsx
 ┃ ┣ 📂Images
 ┃ ┣ 📂js
 ┃ ┃ ┣ 📜api.js
 ┃ ┃ ┗ 📜cookie.js
 ┃ ┣ 📂Pages
 ┃ ┃ ┣ 📜Calendar.jsx
 ┃ ┃ ┣ 📜SignIn.jsx
 ┃ ┃ ┣ 📜SignUp.jsx
 ┃ ┃ ┗ 📜TodoBoard.jsx
 ┃ ┣ 📂style
 ┃ ┃ ┣ 📂fonts
 ┃ ┃ ┣ 📜common.css
 ┃ ┃ ┣ 📜common.css.map
 ┃ ┃ ┣ 📜common.scss
 ┃ ┃ ┣ 📜font.css
 ┃ ┃ ┣ 📜reset.css
 ┃ ┃ ┗ 📜_style.scss
 ┃ ┣ 📜App.css
 ┃ ┣ 📜App.js
 ┃ ┣ 📜App.test.js
 ┃ ┣ 📜index.css
 ┃ ┣ 📜index.js
 ┃ ┣ 📜logo.svg
 ┃ ┣ 📜reportWebVitals.js
 ┃ ┗ 📜setupTests.js
 ┣ 📜.dockerignore
 ┣ 📜.eslintrc
 ┣ 📜.gitignore
 ┣ 📜.prettierrc
 ┣ 📜Dockerfile
 ┣ 📜jsconfig.json
 ┣ 📜nginx.conf
 ┣ 📜package-lock.json
 ┣ 📜package.json
 ┗ 📜README.md
 ```

## CI/CD 파이프라인
1. GitHub에 코드를 Push
2. `.github/workflows/ci-cd.yaml` 이 실행 되면서 GitHub Actions 실행
3. GitHub Actions에서 AWS ECR로 이미지 푸시
4. AWS ECR에 이미지가 푸시된 것을 ArgoCD에서 감지 후 푸시된 이미지로 EKS에 배포

## 사용된 AWS 서비스
* AWS ECR
* AWS EKS
* AWS EC2
* AWS VPC
