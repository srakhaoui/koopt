#!/usr/bin/env groovy

node {
    stage('checkout') {
        checkout scm
    }

    stage('check java') {
        sh "java -version"
    }

    stage('clean') {
        sh "chmod +x mvnw"
        sh "./mvnw clean"
    }

    stage('install tools') {
        sh "./mvnw com.github.eirslett:frontend-maven-plugin:install-node-and-npm -DnodeVersion=v8.12.0 -DnpmVersion=6.4.1"
    }

    stage('npm install') {
        sh "./mvnw com.github.eirslett:frontend-maven-plugin:npm"
    }

    stage('backend tests') {
        try {
            sh "./mvnw test"
        } catch(err) {
            throw err
        } finally {
            junit '**/target/surefire-reports/TEST-*.xml'
        }
    }

    stage('frontend tests') {
        try {
            sh "./mvnw com.github.eirslett:frontend-maven-plugin:npm -Dfrontend.npm.arguments='test -- -u'"
        } catch(err) {
            throw err
        } finally {
            junit '**/target/test-results/jest/TESTS-*.xml'
        }
    }

    stage('packaging') {
        sh "./mvnw verify -Pprod -DskipTests"
        archiveArtifacts artifacts: '**/target/*.war', fingerprint: true
    }

    def imageName = 'coopt-it'
    def imageTag = "v_${BUILD_NUMBER}"
    def repositoryName = env.COOPT_IT_ECR_REGISTRY
    def region = env.COOPT_IT_REGION

    stage('Docker build'){
        sh "cp -R src/main/docker target/"
        sh "cp target/*.war target/docker/"
        docker.build(imageName, 'target/docker')
    }

    stage('Docker push'){
        docker.withRegistry(repositoryName, "ecr:${region}:coopt-it-aws-access-key") {
            docker.image(imageName).push(imageTag)
        }
    }

    stage 'Integration'
    sh '''
        REGION=eu-west-1
        REPOSITORY_NAME=coopt-it
        CLUSTER=CooptItCluster
        FAMILY=`cat taskdef.json | jq .family | tr -d '"'`
        NAME=`cat taskdef.json | jq .containerDefinitions[].name | tr -d '"'`
        SERVICE_NAME=${NAME}-service

        #Store the repositoryUri as a variable
        REPOSITORY_URI=`aws ecr describe-repositories --repository-names ${REPOSITORY_NAME} --region ${REGION} | jq .repositories[].repositoryUri | tr -d '"'`

        #Replace the build number and respository URI placeholders with the constants above
        sed -e "s;%BUILD_NUMBER%;${BUILD_NUMBER};g" -e "s;%REPOSITORY_URI%;${REPOSITORY_URI};g" taskdef.json > ${NAME}-v_${BUILD_NUMBER}.json
        #Register the task definition in the repository
        aws ecs register-task-definition --family ${FAMILY} --cli-input-json file://${WORKSPACE}/${NAME}-v_${BUILD_NUMBER}.json --region ${REGION}
		SERVICES=`aws ecs describe-services --services ${SERVICE_NAME} --cluster ${CLUSTER} --region ${REGION}`
        SERVICES_FAILURES=`echo $SERVICES | jq .failures[]`
		SERVICES_STATUS=`echo $SERVICES | jq .services[].status | tr -d '"'`
        #Get latest revision
        REVISION=`aws ecs describe-task-definition --task-definition ${NAME} --region ${REGION} | jq .taskDefinition.revision`

        #Create or update service
        if [ "$SERVICES_FAILURES" == "" -a "$SERVICES_STATUS" == "ACTIVE" ]; then
            echo "entered existing service"
            DESIRED_COUNT=`aws ecs describe-services --services ${SERVICE_NAME} --cluster ${CLUSTER} --region ${REGION} | jq .services[].desiredCount`
			if [ ${DESIRED_COUNT} = "0" ]; then
				DESIRED_COUNT="1"
			fi
			aws ecs update-service --cluster ${CLUSTER} --region ${REGION} --service ${SERVICE_NAME} --task-definition ${FAMILY}:${REVISION} --desired-count ${DESIRED_COUNT}
        else
			echo "entered new service"
			aws ecs create-service --service-name ${SERVICE_NAME} --desired-count 1 --task-definition ${FAMILY} --cluster ${CLUSTER} --region ${REGION}
        fi
    '''
}
