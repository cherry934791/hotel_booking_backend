// @ts-nocheck
import { FastifyRequest, FastifyReply } from 'fastify';
import { CustomerProfileService } from '../services/customerProfile.service';
import { z } from 'zod';
import {
  UpdateProfileRequestSchema,
  UpdateNotificationsRequestSchema,
  CompleteOnboardingRequestSchema
} from '../schemas/customerProfile.schema';


export class CustomerProfileController {
  private customerProfileService: CustomerProfileService;

  constructor() {
    this.customerProfileService = new CustomerProfileService();
  }

  setFastify(fastify: any) {
    this.customerProfileService.setFastify(fastify);
  }

  // Get customer profile
  async getProfile(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request as any).user.id;
      const profile = await this.customerProfileService.getProfile(userId);
      
      return reply.code(200).send({
        success: true,
        data: profile,
      });
    } catch (error) {
      request.log.error(error);
      
      const statusCode = error.statusCode || 500;
      return reply.code(statusCode).send({
        success: false,
        message: error.message || 'Failed to get profile',
      });
    }
  }

  // Update customer profile
  async updateProfile(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request as any).user.id;
      const profileData = UpdateProfileRequestSchema.parse(request.body);
      
      const processedData = {
        ...profileData,
        dateOfBirth: profileData.dateOfBirth ? new Date(profileData.dateOfBirth) : undefined,
      };
      
      const profile = await this.customerProfileService.updateProfile(userId, processedData);
      
      return reply.code(200).send({
        success: true,
        message: 'Profile updated successfully',
        data: profile,
      });
    } catch (error) {
      request.log.error(error);
      
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
      }
      
      const statusCode = error.statusCode || 500;
      return reply.code(statusCode).send({
        success: false,
        message: error.message || 'Failed to update profile',
      });
    }
  }

  // Update notification preferences
  async updateNotifications(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request as any).user.id;
      const preferences = UpdateNotificationsRequestSchema.parse(request.body);
      
      const profile = await this.customerProfileService.updateNotificationPreferences(userId, preferences);
      
      return reply.code(200).send({
        success: true,
        message: 'Notification preferences updated successfully',
        data: profile,
      });
    } catch (error) {
      request.log.error(error);
      
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
      }
      
      const statusCode = error.statusCode || 500;
      return reply.code(statusCode).send({
        success: false,
        message: error.message || 'Failed to update notification preferences',
      });
    }
  }

 // Complete onboarding
 async completeOnboarding(request: FastifyRequest, reply: FastifyReply) {
   try {
     const userId = (request as any).user.id;
     const onboardingData = CompleteOnboardingRequestSchema.parse(request.body);
     
     const processedData = {
       ...onboardingData,
    
     };
     
     const profile = await this.customerProfileService.completeOnboarding(userId, processedData);
     
     return reply.code(200).send({
       success: true,
       message: 'Onboarding completed successfully',
       data: profile,
     });
   } catch (error) {
     request.log.error(error);
     
     if (error instanceof z.ZodError) {
       return reply.code(400).send({
         success: false,
         message: 'Validation error',
         errors: error.errors,
       });
     }
     
     const statusCode = error.statusCode || 500;
     return reply.code(statusCode).send({
       success: false,
       message: error.message || 'Failed to complete onboarding',
     });
   }
 }
 
 // Skip onboarding
 async skipOnboarding(request: FastifyRequest, reply: FastifyReply) {
   try {
     const userId = (request as any).user.id;
     const profile = await this.customerProfileService.skipOnboarding(userId);
     
     return reply.code(200).send({
       success: true,
       message: 'Onboarding skipped successfully',
       data: profile,
     });
   } catch (error) {
     request.log.error(error);
     
     const statusCode = error.statusCode || 500;
     return reply.code(statusCode).send({
       success: false,
       message: error.message || 'Failed to skip onboarding',
     });
   }
 }

  // Delete profile
  async deleteProfile(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request as any).user.id;
      await this.customerProfileService.deleteProfile(userId);
      
      return reply.code(200).send({
        success: true,
        message: 'Profile deleted successfully',
      });
    } catch (error) {
      request.log.error(error);
      
      return reply.code(500).send({
        success: false,
        message: error.message || 'Failed to delete profile',
      });
    }
  }
}